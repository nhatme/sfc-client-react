import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { MintAddress, SplToken, connection } from "../config/programConfig";
import { anchorProgram, initAnchorProvider, createTxhAndSend, fetchPDA, fetchPDAfromVault } from "./coral";
import { providerPhantomWallet } from "./WalletProvider";
import { BN } from "@coral-xyz/anchor";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

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
        if (program) {
            alert(`You minting ${amount / LAMPORTS_PER_SOL} the SFC token from the Vault`);
            const txInstruction = await program.methods
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
            createTxhAndSend(txInstruction, userPubkey, "Minting", "Minted Success! We're directing to explorer after 3 seconds");
        }
    } catch (error) {
        console.log("Error Instruction: ", error);
    }
}

const mintTokenSFCTarget = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [accountPDAtarget] = fetchPDA(userPubkey, "target");
    const [donatorPDA] = fetchPDA(userPubkey, "client");
    const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
    const amountBN = new BN(amount);
    const bumpBN = new BN(vaultBump);
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    if (program) {
        const accountTarget = await program.account.userTarget.fetch(accountPDAtarget);
        const targetKey = (accountTarget.assetTarget) as PublicKey;
        const tokenAccount = await getOrCreateAssociatedTokenAccount(
            connection, providerPhantomWallet, mintAddress, targetKey
        );
        alert(`You minting ${amountInput} to target address`);
        try {
            const txInstruction = await program.methods
                .tributeAsset(amountBN, bumpBN)
                .accounts({
                    mint: mintAddress,
                    tk: tokenAccount.address,
                    donator: donatorPDA,
                    vault: vaultPDA,
                    signer: userPubkey,
                    token: new PublicKey(SplToken),
                    authority: vaultPDA
                })
                .instruction();
            createTxhAndSend(txInstruction, userPubkey, "Minting to target", "Minted target Success! We're directing to explorer after 3 seconds");
        } catch (error) {
            console.log("Error Instruction: ", error);
        }
    }
}

const burnTokenSFC = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userMint] = fetchPDA(userPubkey, "client");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, userPubkey
    );
    const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
    const amountBN = new BN(amount);
    initAnchorProvider(walletName);
    try {
        const program = await anchorProgram();
        if (program) {
            alert(`You burning ${amount / LAMPORTS_PER_SOL} the SFC token`);
            const txInstruction = await program.methods
                .summonAsset(amountBN)
                .accounts({
                    mint: mintAddress,
                    tk: tokenAccount.address,
                    donator: userMint,
                    vault: vaultPDA,
                    signer: userPubkey,
                    token: new PublicKey(SplToken),
                })
                .instruction();
            createTxhAndSend(txInstruction, userPubkey, "Burning", "Burnt Success! We're directing to explorer after 3 seconds");
        }
    } catch (error) {
        console.log("Error Instruction: ", error);
    }
}

const burnTokenSFCTarget = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [donatorPDA] = fetchPDA(userPubkey, "client");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, userPubkey
    );
    console.log(tokenAccount.address.toString());
    const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
    const amountBN = new BN(amount);
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    if (program) {
        alert(`You burning ${amountInput} to target address`);
        try {
            const txInstruction = await program.methods
                .summonAsset(amountBN)
                .accounts({
                    mint: mintAddress,
                    tk: tokenAccount.address,
                    donator: donatorPDA,
                    vault: vaultPDA,
                    signer: userPubkey,
                    token: new PublicKey(SplToken),
                })
                .instruction();
            createTxhAndSend(txInstruction, userPubkey, "Burning to target", "Burnt target Success! We're directing to explorer after 3 seconds");
        } catch (error) {
            console.log("Error Instruction: ", error);
        }
    }
}

export { mintTokenFromAsset, burnTokenSFC, mintTokenSFCTarget, burnTokenSFCTarget };