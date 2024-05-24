import { AnchorProvider, Program, getProvider, setProvider } from "@coral-xyz/anchor";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { PublicKey, Transaction } from "@solana/web3.js";
import { ProgramId, connection } from "../config/programConfig";
import idl from '../idl/sfcvnd.json';
import { providerPhantomWallet } from "./WalletProvider";
import { TransactionInstruction } from "@solana/web3.js";
window.Buffer = window.Buffer || require("buffer").Buffer;

const phantomAdapter = new PhantomWalletAdapter();
const initAnchorProvider = (walletName: string) => {
    if (walletName === 'Phantom') {
        setProvider(new AnchorProvider(connection, providerPhantomWallet, {
            preflightCommitment: "processed"
        }));
    }
}

const fetchPDA = (userPublickey: PublicKey, seedString: string) => {
    const targetDataPDA = PublicKey.findProgramAddressSync(
        [Buffer.from(`${seedString}`, "utf8"), userPublickey.toBuffer()],
        new PublicKey(ProgramId)
    );
    return targetDataPDA;
}

// fetch PDA from vault
const fetchPDAfromVault = () => {
    const vaultPDA = PublicKey.findProgramAddressSync(
        [Buffer.from("vault")], new PublicKey(ProgramId)
    );
    return vaultPDA;
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
        console.error(error);
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
        return txHash;
    } catch (error) {
        if (error instanceof Error) {
            throw new Error(error.message || "Transaction canceled");
        } else {
            throw new Error("Transaction canceled");
        }
    }
}

const createTxhAndSend = async (txInstruction: TransactionInstruction[], userPublickey: PublicKey, catchMessageTitle?: string, alertMessage?: string) => {
    try {
        const transaction = new Transaction();
        for (const instruction of txInstruction) {
            transaction.add(instruction);
        }
        return await signAndSendTransaction(transaction, userPublickey, alertMessage);
    } catch (error) {
        throw error;
    }
}

export {
    initAnchorProvider,
    fetchPDA,
    fetchPDAfromVault,
    fetchTargetAddress,
    anchorProgram,
    signAndSendTransaction,
    createTxhAndSend
};