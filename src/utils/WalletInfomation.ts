import { PublicKey } from "@solana/web3.js";
import { connection } from "../config/programConfig";

const getTokenBalances = async (userPublickey: string) => {
    const userPubkey = new PublicKey(userPublickey);
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPubkey, {
            programId: new PublicKey('TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA')
        });

        tokenAccounts.value.forEach((tokenAccount) => {
            const accountData = tokenAccount.account.data;
            const tokenAmount = accountData['parsed']['info']['tokenAmount']['uiAmount'];
            const tokenMintAddress = accountData['parsed']['info']['mint'];
            console.log(`Token Mint Address: ${tokenMintAddress}, Balance: ${tokenAmount}`);
        });
    } catch (err) {
        console.error('Error fetching token balances:', err);
    }
}

export default getTokenBalances;
