import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { providerPhantomWallet } from './WalletProvider';
import idl from '../idl/sfcvnd.json';
import { AnchorProvider, Program, getProvider, setProvider } from '@coral-xyz/anchor';

window.Buffer = window.Buffer || require("buffer").Buffer;

// const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"; //devnet
const ProgramId = "DKPreu6SebHaxEWXDEvoX5vXc1wkWEjorvRba1HMrGXc"; //localnet

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
// const connection = new Connection(clusterApiUrl('devnet'), "finalized");
const phantomAdapter = new PhantomWalletAdapter();
const solflareAdapter = new SolflareWalletAdapter();

const signAndConfirmTxh = async (userPublickey: PublicKey, program: Program, targetAddress: PublicKey,) => {
    try {
        const [targetDataPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("target", "utf8"), userPublickey.toBuffer()],
            new PublicKey(ProgramId)
        );
        if (program) {
            alert(`You locking to this target`);
            let txInstruction = await program.methods
                .lockTarget(targetAddress)
                .accounts({
                    target: targetDataPDA,
                    signer: userPublickey,
                    systemProgram: SystemProgram.programId
                })
                .instruction();

            const transaction = new Transaction().add(txInstruction);
            const { blockhash } = await connection.getLatestBlockhash();
            transaction.recentBlockhash = blockhash;
            transaction.feePayer = userPublickey;

            if (!phantomAdapter.connected) {
                await phantomAdapter.connect();
            }

            const txHash = await phantomAdapter.sendTransaction(transaction, connection);
            await connection.confirmTransaction({ signature: txHash, ...await connection.getLatestBlockhash() }, "finalized");
            alert(`You has been lock to this target successful`);
            console.log("Successful", txHash);
            // window.open(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`, "_blank");
            window.open(`https://explorer.solana.com/tx/${txHash}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, "_blank");

        }
    } catch (error) {
        alert(`Error: ${error}`);
    }
}

const lockTargetAddress = (publicKey: string, targetKey: string, walletName: string) => {
    console.log(publicKey);
    console.log(targetKey);
    console.log(walletName);

    if (publicKey !== undefined && targetKey !== undefined) {
        const targetAddress = new PublicKey(targetKey);
        const userPublickey = new PublicKey(publicKey);
        if (walletName) {
            if (walletName === 'Phantom') {
                setProvider(new AnchorProvider(connection, providerPhantomWallet, {
                    preflightCommitment: "processed"
                }));
            }
        }

        anchorProgram()
            .then((program) => {
                if (program) {
                    signAndConfirmTxh(userPublickey, program, targetAddress);
                }
            })
            .catch((error) => {
                console.error("Error setting program: ", error);
            })
    }
}

const anchorProgram = async (): Promise<Program | null> => {
    try {
        const IDL = await Program.fetchIdl(ProgramId);
        if (!IDL) {
            console.error("Error: IDL not found");
            {/* @ts-ignore */ }
            return new Program(idl, getProvider());
        }
        return new Program(IDL, getProvider());
    } catch (error) {
        console.error("Error fetching IDL: ", error);
        return null;
    }
}

export default lockTargetAddress;