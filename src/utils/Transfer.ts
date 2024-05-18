import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js"
import { anchorProgram, initAnchorProvider, fetchPDA } from "./coral";
import { BN } from "@coral-xyz/anchor";

const transferSFCtoken = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [pda] = fetchPDA(userPubkey, "target");
    initAnchorProvider(walletName);
    try {
        const program = await anchorProgram();
        if (program) {
            const fetchUserTarget = await program.account.userTarget.fetch(pda)
                .then(async (target) => {
                    const targetKey = target.assertTarget;
                    try {
                        const amount = new BN(amountInput * LAMPORTS_PER_SOL);
                        const txInstruction = await program.methods
                            .tranferSol(amount)
                            .accounts({
                                target: targetKey as any,
                                signer: userPubkey,
                                systemProgram: SystemProgram.programId

                            })
                            .instruction()

                    } catch (error) {

                    }
                });

        }
    } catch (error) {

    }
}