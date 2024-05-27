import { PublicKey, TokenAccountsFilter } from '@solana/web3.js';
import { MintAddress, SplToken, connection } from '../config/programConfig';
import { anchorProgram, fetchPDA, initAnchorProvider } from './coral';

const fetchBalanceSOL = async (userPublickey: string) => {
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
        let mintAddressList: string[] = [];
        tokenAccounts.value.forEach((tokenAccount) => {
            const accountData = tokenAccount.account.data;
            const tokenAmount = accountData['parsed']['info']['tokenAmount']['uiAmount'];
            const tokenMintAddress = accountData['parsed']['info']['mint'];
            mintAddressList.push(tokenMintAddress);
        });
        return mintAddressList;
    } catch (err) {
        console.error('Error fetching token balances:', err);
    }
}

const getStableSFC = async (userPublickey: string) => {
    const userPubkey = new PublicKey(userPublickey);
    const tokenFilt: TokenAccountsFilter = {
        mint: new PublicKey(MintAddress),
        programId: new PublicKey(SplToken)
    }
    const sfcToken = await connection.getTokenAccountsByOwner(userPubkey, tokenFilt);
    if (sfcToken.value.length > 0) {
        const pubblicKeyToken = sfcToken.value[0].pubkey;
        const walletStableCoin = await connection.getTokenAccountBalance(pubblicKeyToken);
        return walletStableCoin.value.uiAmount;
    } else {
        return "this wallet doesn't have this token, deposit now!";
    }
}

const getAssetUser = async (userPublickey: string, walletName: string) => {
    const userPubkey = new PublicKey(userPublickey);
    const [userPDA] = fetchPDA(userPubkey, "client");
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    const userInfo = await program?.account.userInfor.fetch(userPDA);
    const userWalletAsset = userInfo?.assetAccount as PublicKey;
    return userWalletAsset.toString();
}

const formatConverter = (number: any): string => {
    const formatNum = new Intl.NumberFormat("vi-VN").format(number);
    return formatNum;
}

export { fetchBalanceSOL, formatConverter, getListTokenFromWallet, getStableSFC, getAssetUser };