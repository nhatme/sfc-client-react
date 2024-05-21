import { PublicKey, SystemProgram } from '@solana/web3.js';
import { anchorProgram, initAnchorProvider, createTxhAndSend } from './coral';

const lockTargetAddress = async (publicKey: string, targetKey: string, walletName: string, pda: PublicKey) => {
    if (publicKey !== undefined && targetKey !== undefined) {
        const targetAddress = new PublicKey(targetKey);
        const userPublickey = new PublicKey(publicKey);
        initAnchorProvider(walletName);
        try {
            const program = await anchorProgram();
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
                createTxhAndSend([txInstruction], userPublickey, "lockTarget", "locktarget");
            }
        } catch (error) {
            console.log("Program anchor caught: ", error);
        }
    }
}

export { lockTargetAddress };