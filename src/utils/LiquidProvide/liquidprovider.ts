import { LAMPORTS_PER_SOL, PublicKey, SystemProgram, TokenAccountsFilter } from "@solana/web3.js"
import { MintAddress, MintAddressLP, SplToken, connection } from "../../config/programConfig"
import { anchorProgram, createTxhAndSend, fetchPDAfromVault, initAnchorProvider } from "../coral";
import { BN } from "@coral-xyz/anchor";
export type typeliquidity = "add" | "widthdraw";

const mintAndBurnLPtoken = async (publickey: string, amountInput: number, walletName: string, action: typeliquidity) => {
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
    const tokenAccSFCinVault = await connection.getParsedTokenAccountsByOwner(pdaVault, tokenFiltSFC);
    const tokenAccLPuser = await connection.getParsedTokenAccountsByOwner(userPublickey, tokenFiltLP);

    const amountBN = new BN(amountInput * LAMPORTS_PER_SOL);
    const bumpBN = new BN(bump);
    const method = action === "add" ? "provideLiquidity" : "withdrawLiquidity";
    initAnchorProvider(walletName);
    const program = await anchorProgram();
    try {
        const txInstruction = await program?.methods[method](amountBN, bumpBN)
            .accounts({
                donatorsfc: tokenAccSFCUser.value[0].pubkey,
                vaultsfc: tokenAccSFCinVault.value[0].pubkey,
                donatorlp: tokenAccLPuser.value[0].pubkey,
                vaultsol: pdaVault,
                mint: mintLPaddress,
                signer: userPublickey,
                token: new PublicKey(SplToken),
                systemProgram: SystemProgram.programId
            })
            .instruction();
        if (txInstruction)
            return createTxhAndSend([txInstruction], userPublickey);
    } catch (error) {
        throw error;
    }
}

export { mintAndBurnLPtoken };