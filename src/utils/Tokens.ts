import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { MintAddress, connection } from "../config/programConfig";
import { PublicKey } from "@solana/web3.js";
import { createAnchorProvider, createTxhAndSend } from "./coral";

const openTokenAcc = async (userPublickey: string, walletName: string) => {
    const mintAddressPubkey = new PublicKey(MintAddress);
    const userPubkey = new PublicKey(userPublickey);
    const tokenAccount = getAssociatedTokenAddressSync(mintAddressPubkey, userPubkey);
    const tokenAccInfo = await connection.getAccountInfo(tokenAccount);
    console.log(tokenAccInfo);
    
    createAnchorProvider(walletName);
    if (tokenAccInfo === null) {        
        const tokenAccInstruction = createAssociatedTokenAccountInstruction(
            userPubkey, tokenAccount, userPubkey, mintAddressPubkey
        );
        createTxhAndSend(tokenAccInstruction, userPubkey, "open token account", "open token account");
    } else {
        alert("You have this token")
    }
}

export { openTokenAcc };