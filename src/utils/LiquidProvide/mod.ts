import { PublicKey, TokenAccountsFilter } from "@solana/web3.js";
import { MintAddress, MintAddressLP, connection } from "../../config/programConfig";
import { fetchPDAfromVault } from "../coral";

const [pdaVault] = fetchPDAfromVault();

const fetchLPtokenSupply = async () => {
    const mint = new PublicKey(MintAddressLP);
    const getLPsupply = await connection.getTokenSupply(mint);
    return Number(getLPsupply.value.amount);
}

const fetchSOLfromVault = async () => {
    const poolSOL = await connection.getBalance(pdaVault);
    return poolSOL; // data in lamport
}

const fetchSFCfromVault = async () => {
    const tokenFiltSFC: TokenAccountsFilter = {
        mint: new PublicKey(MintAddress),
        programId: new PublicKey(MintAddressLP)
    }
    const tokenAccSFC = await connection.getTokenAccountsByOwner(pdaVault, tokenFiltSFC);
    if (tokenAccSFC.value.length > 0) {
        const tokenAccPubkey = tokenAccSFC.value[0].pubkey;
        const poolSFC = await connection.getTokenAccountBalance(tokenAccPubkey);
        return Number(poolSFC.value.amount); // data in lamport
    } else {
        return 0;
    }
}

export { fetchLPtokenSupply, fetchSFCfromVault, fetchSOLfromVault }