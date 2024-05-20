import { PublicKey } from '@solana/web3.js';
import { MintAddress, SplToken, connection } from '../config/programConfig';

const fetchBalanceSFC = async (userPublickey: string) => {
    const publicKey = new PublicKey(userPublickey);
    try {
        return await connection.getBalance(publicKey, "confirmed");
    } catch (error) {
        console.error("Error fetching balance:", error);
    }
}

const getListTokenFromWallet = async (userPublickey: string) => {
    const userPubkey = new PublicKey(userPublickey);
    try {
        const tokenAccounts = await connection.getParsedTokenAccountsByOwner(userPubkey, {
            programId: new PublicKey(SplToken)
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

const getTokenMetadata = async (userPublickey: string) => {
    const userPubkey = new PublicKey(userPublickey);
    try {

    } catch (error) {

    }
}

const formatConverter = (number: any): string => {
    const formatNum = new Intl.NumberFormat("us-US", { style: 'currency', currency: 'USD' }).format(number)
    return formatNum;
}

export { fetchBalanceSFC, formatConverter, getListTokenFromWallet, getTokenMetadata };