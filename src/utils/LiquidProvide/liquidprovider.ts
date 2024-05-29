import { LAMPORTS_PER_SOL, PublicKey, TokenAccountsFilter } from "@solana/web3.js"
import { MintAddress, MintAddressLP, SplToken, connection } from "../../config/programConfig"
import { fetchPDAfromVault } from "../coral";
import { BN } from "@coral-xyz/anchor";

const mintLPtoken = async (publickey: string, amountInput: number) => {
    const mintLPaddress = new PublicKey(MintAddressLP);
    const mintSFCaddress = new PublicKey(MintAddress);
    const userPublickey = new PublicKey(publickey);

    const [pdaVault, bump] = fetchPDAfromVault();
    const tokenFiltSFC: TokenAccountsFilter = {
        mint: mintSFCaddress,
        programId: new PublicKey(SplToken)
    }
    const tokenFiltLP: TokenAccountsFilter = {
        mint: mintLPaddress,
        programId: new PublicKey(SplToken)
    }

    const tokenAccSFCUser = await connection.getParsedTokenAccountsByOwner(userPublickey, tokenFiltSFC);
    const tokenAccVault = await connection.getParsedTokenAccountsByOwner(pdaVault, tokenFiltSFC);
    const tokenAccLPuser = await connection.getParsedTokenAccountsByOwner(userPublickey, tokenFiltLP);

    const amount = new BN(amountInput * LAMPORTS_PER_SOL);
    const pool = new BN();

    console.log(tokenAccSFCUser.value[0].pubkey.toString());
    

}

export { mintLPtoken };