import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { MintAddress, SplToken, connection } from "../config/programConfig";
import { anchorProgram, initAnchorProvider, createTxhAndSend, fetchPDA, fetchPDAfromVault } from "./coral";
import { providerPhantomWallet } from "./WalletProvider";
import { BN } from "@coral-xyz/anchor";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { transferAssets } from "./Transfer";

const mintAddress = new PublicKey(MintAddress);
const [vaultPDA, vaultBump] = fetchPDAfromVault();

const mintTokenFromAsset = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userMint] = fetchPDA(userPubkey, "client");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, userPubkey
    );
    const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
    const amountBN = new BN(amount);
    const bumpBN = new BN(vaultBump);
    initAnchorProvider(walletName);
    try {
        const program = await anchorProgram();
        const txInstruction = await program?.methods
            .tributeAsset(amountBN, bumpBN)
            .accounts({
                mint: mintAddress,
                tk: tokenAccount.address,
                donator: userMint,
                vault: vaultPDA,
                signer: userPubkey,
                token: new PublicKey(SplToken),
                authority: vaultPDA
            })
            .instruction();
        if (txInstruction)
            return createTxhAndSend([txInstruction], userPubkey, "Minting", "Minted Success! We're directing to explorer after 3 seconds");
    } catch (error) {
        throw error;
    }
}

const mintTokenSFCTarget = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [accountPDAtarget] = fetchPDA(userPubkey, "target");
    const [userMint] = fetchPDA(userPubkey, "client");
    const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
    const amountBN = new BN(amount);
    const bumpBN = new BN(vaultBump);
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    const accountTarget = await program?.account.userTarget.fetch(accountPDAtarget);
    const targetKey = (accountTarget?.assetTarget) as PublicKey;
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, targetKey
    );
    try {
        const txInstruction = await program?.methods
            .tributeAsset(amountBN, bumpBN)
            .accounts({
                mint: mintAddress,
                tk: tokenAccount.address,
                donator: userMint,
                vault: vaultPDA,
                signer: userPubkey,
                token: new PublicKey(SplToken),
                authority: vaultPDA
            })
            .instruction();
        if (txInstruction)
            return createTxhAndSend([txInstruction], userPubkey, "Minting to target", "Minted target Success! We're directing to explorer after 3 seconds");
    } catch (error) {
        throw error;
    }

}
const burnTokenSFCandTarget = async (userPublickey: string, walletName: string, amountInput: number, isTarget: boolean, state?: string) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userBurn] = fetchPDA(userPubkey, "client");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, userPubkey
    );
    const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
    const amountBN = new BN(amount);
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    if (program) {
        try {
            const txInstruction = await program.methods
                .summonAsset(amountBN)
                .accounts({
                    mint: mintAddress,
                    tk: tokenAccount.address,
                    donator: userBurn,
                    vault: vaultPDA,
                    signer: userPubkey,
                    token: new PublicKey(SplToken),
                })
                .instruction();
            if (!isTarget) {
                return createTxhAndSend([txInstruction], userPubkey);
            } else {
                const transferInstruction = await transferAssets(userPublickey, walletName, amount, state);
                if (transferInstruction && typeof transferInstruction !== "string")
                    return createTxhAndSend([txInstruction, transferInstruction], userPubkey);
            }

        } catch (error) {
            throw error;
        }
    }
}

export { mintTokenFromAsset, mintTokenSFCTarget, burnTokenSFCandTarget };