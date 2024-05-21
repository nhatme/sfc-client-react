import { LAMPORTS_PER_SOL, PublicKey, SystemProgram } from "@solana/web3.js"
import { anchorProgram, initAnchorProvider, fetchPDA, createTxhAndSend } from "./coral";
import { BN } from "@coral-xyz/anchor";

const transferSFCtoken = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [pda] = fetchPDA(userPubkey, "target");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    if (program) {
        const userTarget = await program.account.userTarget.fetch(pda)
        const targetKey = userTarget.assertTarget as PublicKey;
        try {
            const amount = new BN(amountInput * LAMPORTS_PER_SOL);
            const txInstruction = await program.methods
                .tranferSol(amount)
                .accounts({
                    target: targetKey,
                    signer: userPubkey,
                    systemProgram: SystemProgram.programId
                })
                .instruction();
            return txInstruction;
        } catch (error) {
            console.log(error);
        }
    }
}

const transferAssets = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [targetPDA] = fetchPDA(userPubkey, "target");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    const userTarget = await program?.account.userTarget.fetch(targetPDA);
    const targetAddress = (userTarget?.assetTarget) as PublicKey;
    const [receivePDA] = fetchPDA(targetAddress, "client");
    const [fromPDA] = fetchPDA(userPubkey, "client");
    const amountBN = new BN(amountInput / 100000);
    alert(`Transfer Asset burnt ${amountInput} to target wallet`);
    try {
        const txInstruction = await program?.methods
            .tranferAsset(amountBN)
            .accounts({
                target: targetPDA,
                fromclient: fromPDA,
                toclient: receivePDA,
                signer: userPubkey
            })
            .instruction();
        return txInstruction;
    } catch (error) {
        console.log(error);
    }
}

const transferAssetTarget = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userTarget] = fetchPDA(userPubkey, "target");
    const [fromPDA] = fetchPDA(userPubkey, "client");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    const accountTarget = await program?.account.userTarget.fetch(userTarget);
    const targetAddress = accountTarget?.assetTarget as PublicKey;
    const [receiveTarget] = fetchPDA(targetAddress, "client");
    const amountBN = new BN(amountInput);
    alert(`Transfer Asset ${amountInput} to target wallet`);
    try {
        const txInstruction = await program?.methods
            .tranferAsset(amountBN)
            .accounts({
                target: userTarget,
                fromclient: fromPDA,
                toclient: receiveTarget,
                signer: userPubkey
            })
            .instruction();
        if (txInstruction)
            createTxhAndSend([txInstruction], userPubkey, "transfered", "transfered successful, 3-2-1 direct");
    } catch (error) {

    }
}

export { transferAssets, transferSFCtoken, transferAssetTarget };