import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js"
import { MintAddress, connection } from "../config/programConfig";
import { anchorProgram, createTxhAndSend, fetchPDA, fetchPDAfromVault } from "./coral";
import { getOrCreateAssociatedTokenAccount } from "@solana/spl-token";
import { providerPhantomWallet } from "./WalletProvider";
import { BN } from "@coral-xyz/anchor";

const mintTokenFromAsset = async (userPublickey: string, amountInput: number) => {
    const mintAddress = new PublicKey(MintAddress);
    const userPubkey = new PublicKey(userPublickey);
    const [vaultPDA, vaultBump] = fetchPDAfromVault();
    const [userMint] = fetchPDA(userPubkey, "client");
    const tokenAccount = await getOrCreateAssociatedTokenAccount(
        connection, providerPhantomWallet, mintAddress, userPubkey
    );
    try {
        const amount = (Number(amountInput).valueOf()) * LAMPORTS_PER_SOL;
        const amountBN = new BN(amount);
        const bumpBN = new BN(vaultBump);
        anchorProgram()
            .then(async (program) => {
                console.log(program);
                
                if (program) {
                    alert(`You minting ${amount} the SFC token from the Vault`);
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
            })
            .catch(err => {
                console.log("program caught: ", err);
            })

    } catch (error) {
        console.log("Error: ", error);
    }
}

export default mintTokenFromAsset;