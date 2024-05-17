import { Program } from "@coral-xyz/anchor";
import { PublicKey } from "@solana/web3.js";

const ProgramId = "DKPreu6SebHaxEWXDEvoX5vXc1wkWEjorvRba1HMrGXc";

const fetchPDA = (userPublickey: PublicKey) => {
    const [targetDataPDA, number] = PublicKey.findProgramAddressSync(
        [Buffer.from("target", "utf8"), userPublickey.toBuffer()],
        new PublicKey(ProgramId)
    );
    return [targetDataPDA, number];
}

const fetchTargetAddress = async (programTarget: Program, pda: PublicKey) => {
    if (programTarget) {
        return await programTarget.account.userTarget.fetch(pda);
    }
    return null;
}

export { fetchPDA, fetchTargetAddress };