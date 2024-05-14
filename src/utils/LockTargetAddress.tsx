import { FC, useState } from 'react';
import { AnchorProvider, Program, Wallet, getProvider, setProvider } from '@coral-xyz/anchor';
import { PhantomWallet, SolflareWallet } from './Wallet';
import { Connection, PublicKey, SystemProgram, Transaction, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '../hooks/useWallet';

const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX";
const connection = new Connection(clusterApiUrl('devnet'), "finalized");

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
            const txHash = await PhantomWallet.signTransaction(transaction, connection);
            await connection.confirmTransaction(txHash);
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
    const targetAddress = new PublicKey(state?.publicKeyTarget);
    const userPublickey = new PublicKey(state?.myPublicKey?.publicKey);
    const walletName = state?.myPublicKey.walletType;
    if (walletName) {
        if (walletName === 'Phantom') {
            setProvider(new AnchorProvider(connection, PhantomWallet, {
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

            signAndConfirmTxh(userPublickey, programTarget, targetAddress);

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