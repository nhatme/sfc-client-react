import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { MintAddress, connection } from "../config/programConfig";
import { anchorProgram, initAnchorProvider, createTxhAndSend, fetchPDA, fetchPDAfromVault } from "./coral";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { providerPhantomWallet } from "./WalletProvider";
import { BN } from "@coral-xyz/anchor";

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
                    token: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                    authority: vaultPDA
                })
                .instruction()
            createTxhAndSend(txInstruction, userPubkey, "Minting", "Minting");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

const burnTokenSFC = async (userPublickey: string, walletName: string, amountInput: number) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userMint] = fetchPDA(userPubkey, "client");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, userPubkey
    )
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
                    token: new PublicKey("TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA"),
                })
                .instruction()
            createTxhAndSend(txInstruction, userPubkey, "Burning", "Burning");
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

export { mintTokenFromAsset, burnTokenSFC };