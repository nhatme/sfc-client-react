import { PublicKey, SystemProgram } from "@solana/web3.js";
import { anchorProgram, initAnchorProvider, createTxhAndSend } from "./coral";

const openAsset = async (publicKey: string, walletName: string, pda: PublicKey) => {
    const userPublickey = new PublicKey(publicKey);
    initAnchorProvider(walletName);
    try {
        const program = await anchorProgram();
        if (program) {
            alert(`Your asset account opening`);
            const txInstruction = await program.methods
                .initUser()
                .accounts({
                    client: pda,
                    signer: userPublickey,
                    systemProgram: SystemProgram.programId
                })
                .instruction();
            createTxhAndSend(txInstruction, userPublickey, "Asset Account", "Asset Account");
        }
    } catch (error) {
        console.error("Error setting program: ", error);

    }
}

const closeAsset = async (publicKey: string, walletName: string, pda: PublicKey) => {
    const userPublickey = new PublicKey(publicKey);
    initAnchorProvider(walletName);
    try {
        const program = await anchorProgram();
        if (program) {
            alert(`Your asset account closing`);
            const txInstruction = await program.methods
                .clearUser()
                .accounts({
                    client: pda,
                    signer: userPublickey,
                })
                .instruction();
            createTxhAndSend(txInstruction, userPublickey);
        }
    } catch (error) {
        console.error("Error setting program: ", error);

    }
}


export { openAsset, closeAsset };