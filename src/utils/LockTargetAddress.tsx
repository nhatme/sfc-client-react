import { FC, useState } from 'react';
import { AnchorProvider, Program, Wallet, getProvider, setProvider } from '@coral-xyz/anchor';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '../hooks/useWallet';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';
import { SolflareWalletAdapter } from '@solana/wallet-adapter-solflare';

const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX";
const connection = new Connection(clusterApiUrl('devnet'), "finalized");
const phantomAdapter = new PhantomWalletAdapter();
const solflareAdapter = new SolflareWalletAdapter();

const signAndConfirmTxh = async (userPublickey: any, programTarget: any, targetAddress: any,) => {
    try {
        const [targetDataPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("target", "utf8"), userPublickey.toBuffer()],
            new PublicKey(ProgramId)
        );
        if (programTarget) {
            alert(`You locking to this target`);
            let txInstruction = await programTarget.methods
                .lockTarget(targetAddress)
                .accounts({
                    target: targetDataPDA,
                    signer: userPublickey,
                    systemProgram: SystemProgram.programId
                })
                .instruction();
            const transaction = new Transaction().add(txInstruction);
            const txHash = await phantomAdapter.signTransaction(transaction);
            await connection.confirmTransaction(txHash, "finalized");
            alert(`You has been lock to this target successful`);
            // finalTransaction(txHash, false);
        }
    } catch (error) {
        alert(error);
    }
}

const LockTargetAddress: FC = () => {
    const { state } = useWallet();
    const [programTarget, setProgramTarget] = useState<Program | null>(null);
    const [userPublicKey, setUserPublickey] = useState<PublicKey | null>(null);
    const [targetAddress, setTargetPublickey] = useState<PublicKey | null>(null);

    const publicKey = state.myPublicKey.publicKey;
    const targetKey = state.publicKeyTarget;
    if (publicKey !== undefined && targetKey !== undefined) {
        const targetAddress = new PublicKey(targetKey);
        setTargetPublickey(targetAddress);
        const userPublickey = new PublicKey(publicKey);
        setUserPublickey(userPublickey);
    }
    const walletName = state?.myPublicKey.walletType;
    if (walletName) {
        if (walletName === 'Phantom') {
            setProvider(new AnchorProvider(connection, phantomAdapter, {
                preflightCommitment: "confirmed"
            }));
            Program.fetchIdl(ProgramId)
                .then((IDL) => {
                    if (IDL === null) {
                        console.error("Error: IDL not found");
                    } else {
                        const programTarget = new Program(IDL, new PublicKey(ProgramId), getProvider());
                        setProgramTarget(programTarget);
                    }
                })
                .catch((error) => {
                    console.error("Error fetching IDL: ", error);
                });

            signAndConfirmTxh(userPublicKey, programTarget, targetAddress);

            return (
                <div>???</div>
            )
        }
    }

    return (
        <div>LockTargetAddress</div>
    )
}

export default LockTargetAddress