import { LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter } from "@solana/web3.js"
import { anchorProgram, initAnchorProvider, fetchPDA, createTxhAndSend } from "./coral";
import { BN } from "@coral-xyz/anchor";
import { MintAddress, SplToken, connection } from "../config/programConfig";

const transferSFCtoken = async (userPublickey: string, walletName: string, amountInput: number) => {
    alert(`You transfering to this target`);
    const amount = new BN(amountInput * LAMPORTS_PER_SOL);
    const userPubkey = new PublicKey(userPublickey);
    const [targetPDA] = fetchPDA(userPubkey, "target");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    const userTarget = await program?.account.userTarget.fetch(targetPDA);
    const targetKey = userTarget?.assetTarget as PublicKey;
    const tokenFiltSFC: TokenAccountsFilter = {
        mint: new PublicKey(MintAddress),
        programId: new PublicKey(SplToken)
    }
    const fromTokenAcc = await connection.getParsedTokenAccountsByOwner(userPubkey, tokenFiltSFC);
    const toTokenAcc = await connection.getParsedTokenAccountsByOwner(targetKey, tokenFiltSFC);
    try {
        const txInstruction = await program?.methods
            .tranferToken(amount, true)
            .accounts({
                token: new PublicKey(SplToken),
                fromtoken: fromTokenAcc.value[0].pubkey,
                totoken: toTokenAcc.value[0].pubkey,
                signer: userPubkey,
            })
            .instruction();
        if (txInstruction)
            return createTxhAndSend([txInstruction], userPubkey);
    } catch (error) {
        throw error;
    }
}

const transferAssets = async (userPublickey: string, walletName: string, amountInput: number, state?: string) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userTarget] = fetchPDA(userPubkey, "target");
    const [fromPDA] = fetchPDA(userPubkey, "client");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    const accountTarget = await program?.account.userTarget.fetch(userTarget);
    const targetAddress = accountTarget?.assetTarget as PublicKey;
    const [receiveTarget] = fetchPDA(targetAddress, "client");
    let amountBN: BN;
    if (state) {
        amountBN = new BN(amountInput / 100000);
        // alert(`Transfer Asset burnt ${amountInput} to target wallet`);
    } else {
        amountBN = new BN(amountInput);
        // alert(`Transfer Asset ${amountInput} to target wallet`);
    }
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
        if (state) {
            return txInstruction;
        } else {
            if (txInstruction)
                return createTxhAndSend([txInstruction], userPubkey);
        }
    } catch (error) {
        throw error;
    }
}

export { transferSFCtoken, transferAssets };