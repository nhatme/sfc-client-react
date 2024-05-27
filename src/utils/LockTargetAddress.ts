import { PublicKey, SystemProgram } from '@solana/web3.js';
import { anchorProgram, initAnchorProvider, createTxhAndSend, fetchPDA } from './coral';

const lockTargetAddress = async (publicKey: string, targetKey: string, walletName: string) => {
    const targetAddress = new PublicKey(targetKey);
    const userPublickey = new PublicKey(publicKey);
    const [pda] = fetchPDA(new PublicKey(userPublickey), "target");
    initAnchorProvider(walletName);
    try {
        const program = await anchorProgram();
        if (program) {
            const txInstruction = await program.methods
                .lockTarget(targetAddress)
                .accounts({
                    target: new PublicKey(pda),
                    signer: userPublickey,
                    systemProgram: SystemProgram.programId
                })
                .instruction();
            return createTxhAndSend([txInstruction], userPublickey);
        }
    } catch (error) {
        throw error;
    }
}

export { lockTargetAddress };