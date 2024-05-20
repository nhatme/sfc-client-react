import { PublicKey } from "@solana/web3.js"
import { anchorProgram, createTxhAndSend, fetchPDA, initAnchorProvider } from "./coral";
import { BN } from "@coral-xyz/anchor";

const depositAsset = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userPDA] = fetchPDA(userPubkey, "target");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    if (program) {
        const accountTarget = await program.account.userTarget.fetch(userPDA);
        const targetKey = (accountTarget.assetTarget) as PublicKey;
        const [playerDataPDA] = fetchPDA(targetKey, "client");

        const amount = Number(amountInput).valueOf();
        const amountBN = new BN(amount);
        alert(`You depositing ${amount} to this target`);
        const txInstruction = await program.methods
            .depositAsset(amountBN)
            .accounts({
                target: userPDA,
                client: playerDataPDA,
                signer: userPubkey
            })
            .instruction();
        try {
            createTxhAndSend(txInstruction, userPubkey, "deposit catch", "deposit alert");
        } catch (error) {
            console.log("deposit error: ", error);
        }
    }
}

const withdrawAsset = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userPDA] = fetchPDA(userPubkey, "target");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    if (program) {
        const accountTarget = await program.account.userTarget.fetch(userPDA);
        const targetKey = (accountTarget.assetTarget) as PublicKey;
        const [clientPDA] = fetchPDA(targetKey, "client");
        const amount = Number(amountInput).valueOf();
        const amountBN = new BN(amount);
        alert(`You withdrawing ${amount} from this target`);
        const txInstruction = await program.methods
            .withdrawAsset(amountBN)
            .accounts({
                target: userPDA,
                client: clientPDA,
                signer: userPubkey
            })
            .instruction();
        try {
            createTxhAndSend(txInstruction, userPubkey, "withdraw catch", "withdraw alert");
        } catch (error) {
            console.log("withdraw error: ", error);
        }
    }
}

export { depositAsset, withdrawAsset }