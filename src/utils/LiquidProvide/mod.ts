import { PublicKey, TokenAccountsFilter } from "@solana/web3.js";
import { MintAddress, MintAddressLP, connection } from "../../config/programConfig";
import { fetchPDAfromVault } from "../coral";

const [pdaVault] = fetchPDAfromVault();
const fetchLPtokenSupply = async () => {
    const mint = new PublicKey(MintAddressLP);
    const getLPsupply = await connection.getTokenSupply(mint);
    return getLPsupply.value.amount;
}

const fetchSOLfromVault = async () => {
    return await connection.getBalance(pdaVault);
}

const fetchSFCfromVault = async () => {
    const tokenFiltSFC: TokenAccountsFilter = {
        mint: new PublicKey(MintAddress),
        programId: new PublicKey(MintAddressLP)
    }
    const tokenAccSFC = await connection.getTokenAccountsByOwner(pdaVault, tokenFiltSFC);
    if (tokenAccSFC) {
        console.log("getTokenAccountsByOwner: ", tokenAccSFC.value[0].pubkey.toString());
    }
}

export { fetchLPtokenSupply, fetchSFCfromVault }