import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';
import { providerPhantomWallet } from './WalletProvider';

import { AnchorProvider, Program, getProvider, setProvider } from '@coral-xyz/anchor';
import { anchorProgram, signAndSendTransaction } from './coral';
window.Buffer = window.Buffer || require("buffer").Buffer;

// const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"; //devnet
const ProgramId = "DKPreu6SebHaxEWXDEvoX5vXc1wkWEjorvRba1HMrGXc"; //localnet

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
// const connection = new Connection(clusterApiUrl('devnet'), "finalized");

const phantomAdapter = new PhantomWalletAdapter();
const solflareAdapter = new SolflareWalletAdapter();

const signAndConfirmTxh = async (userPublickey: PublicKey, program: Program, targetAddress: PublicKey, pda: PublicKey) => {
    try {
        if (program) {
            alert(`You locking to this target`);
            const txInstruction = await program.methods
                .lockTarget(targetAddress)
                .accounts({
                    target: new PublicKey(pda),
                    signer: userPublickey,
                    systemProgram: SystemProgram.programId
                })
                .instruction();

            const transaction = new Transaction().add(txInstruction);

            signAndSendTransaction(transaction, userPublickey, "You has been lock to this target successful");

            // const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
            // transaction.recentBlockhash = blockhash;
            // transaction.feePayer = userPublickey;

            // if (!phantomAdapter.connected) {
            //     await phantomAdapter.connect();
            // }

            // const txHash = await phantomAdapter.sendTransaction(transaction, connection);
            // await connection.confirmTransaction({ signature: txHash, ...await connection.getLatestBlockhash() }, "finalized");
            // alert(`You has been lock to this target successful`);
            // console.log("Successful", txHash);

            // window.open(`https://explorer.solana.com/tx/${txHash}?cluster=devnet`, "_blank");
            // window.open(`https://explorer.solana.com/tx/${txHash}?cluster=custom&customUrl=http%3A%2F%2Flocalhost%3A8899`, "_blank");

        }

    } catch (error) {
        alert(`Error signAndConfirm: ${error}`);
    }
}

const lockTargetAddress = (publicKey: string, targetKey: string, walletName: string, pda: PublicKey) => {
    // console.log(publicKey);
    // console.log(targetKey);
    // console.log(walletName);

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
                    signAndConfirmTxh(userPublickey, program, targetAddress, pda);
                }
            })
            .catch((error) => {
                console.error("Error setting program: ", error);
            })
    }
}

export { lockTargetAddress };