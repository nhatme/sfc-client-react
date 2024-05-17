import { Program, getProvider } from "@coral-xyz/anchor";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { Connection, PublicKey, Transaction, clusterApiUrl } from "@solana/web3.js";
import idl from '../idl/sfcvnd.json';

// const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX"; //devnet
const ProgramId = "DKPreu6SebHaxEWXDEvoX5vXc1wkWEjorvRba1HMrGXc"; //localnet
const connection = new Connection("http://127.0.0.1:8899", "confirmed");
// const connection = new Connection(clusterApiUrl('devnet'), "finalized");
const phantomAdapter = new PhantomWalletAdapter();

const fetchPDA = (userPublickey: PublicKey, seedString: string) => {
    const [targetDataPDA, number] = PublicKey.findProgramAddressSync(
        [Buffer.from(`${seedString}`, "utf8"), userPublickey.toBuffer()],
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

const anchorProgram = async (): Promise<Program | null> => {
    try {
        const IDL = await Program.fetchIdl(ProgramId);
        if (!IDL) {
            console.error("Error: IDL not found");
            {/* @ts-ignore */ }
            return new Program(idl, new PublicKey(ProgramId), getProvider());
        }
        return new Program(IDL, new PublicKey(ProgramId), getProvider());
    } catch (error) {
        console.error("Error fetching IDL: ", error);
        return null;
    }
}

const signAndSendTransaction = async (transaction: Transaction, userPublickey: PublicKey, alertMessage?: string) => {
    const { blockhash, lastValidBlockHeight } = await connection.getLatestBlockhash();
    transaction.recentBlockhash = blockhash;
    transaction.feePayer = userPublickey;

    if (!phantomAdapter.connected) {
        await phantomAdapter.connect();
    }

    try {
        const txHash = await phantomAdapter.sendTransaction(transaction, connection);
        await connection.confirmTransaction({ signature: txHash, ...await connection.getLatestBlockhash() }, "confirmed");
        alert(`${alertMessage}`);
        console.log("Successful", txHash);
    } catch (error) {
        console.log("signAndSendTransaction caught: ", error);
    }

}

export { fetchPDA, fetchTargetAddress, anchorProgram, signAndSendTransaction };