import { createAssociatedTokenAccountInstruction, getAssociatedTokenAddressSync } from "@solana/spl-token";
import { MintAddress, connection } from "../config/programConfig";
import { PublicKey } from "@solana/web3.js";
import { createTxhAndSend } from "./coral";

const openTokenAcc = async (userPublickey: string) => {
    const mintAddressPubkey = new PublicKey(MintAddress);
    const userPubkey = new PublicKey(userPublickey);
    const tokenAccount = getAssociatedTokenAddressSync(mintAddressPubkey, userPubkey);
    const tokenAccInfo = await connection.getAccountInfo(tokenAccount);
    if (tokenAccInfo === null) {
        const tokenAccInstruction = createAssociatedTokenAccountInstruction(
            userPubkey, tokenAccount, userPubkey, mintAddressPubkey
        );
        createTxhAndSend([tokenAccInstruction], userPubkey, "open token account", "open token account");
    } else {
        return true; // opened
    }
}

export { openTokenAcc };