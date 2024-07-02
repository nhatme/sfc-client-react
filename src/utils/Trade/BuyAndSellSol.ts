import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TokenAccountsFilter } from "@solana/web3.js";
import { anchorProgram, createTxhAndSend, fetchPDAfromVault, initAnchorProvider } from "../coral";
import { MintAddress, SplToken, connection } from "../../config/programConfig";
import { BN } from "@coral-xyz/anchor";
import { Trading } from "../../store/types";

const buyAndSellSOLviaSFC = async (publickey: string, amount: number, walletName: string, method?: Trading) => {
    const userPubkey = new PublicKey(publickey);
    const [pdaVault, bump] = fetchPDAfromVault();
    const tokenSfcFilt: TokenAccountsFilter = {
        mint: new PublicKey(MintAddress),
        programId: new PublicKey(SplToken)
    }
    const tokenAccUserSfc = await connection.getParsedTokenAccountsByOwner(userPubkey, tokenSfcFilt);
    const tokenAccVaultSfc = await connection.getParsedTokenAccountsByOwner(pdaVault, tokenSfcFilt);
    const amountBN = new BN(amount * LAMPORTS_PER_SOL);
    const bumpBN = new BN(bump);
    const methodTrade = method === "buy" ? "buySol" : "sellSol";
    const args = [amountBN];
    if (method === "sell") {
        args.push(bumpBN)
    }
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    try {
        const txInstruction = await program?.methods[methodTrade](...args)
            .accounts({
                donator: tokenAccUserSfc.value[0].pubkey,
                vaultsfc: tokenAccVaultSfc.value[0].pubkey,
                vaultsol: pdaVault,
                signer: userPubkey,
                token: new PublicKey(SplToken),
                systemProgram: SystemProgram.programId
            })
            .instruction();
        if (txInstruction)
            return createTxhAndSend([txInstruction], userPubkey);
    } catch (error) {
        throw error;
    }
}

export default buyAndSellSOLviaSFC;