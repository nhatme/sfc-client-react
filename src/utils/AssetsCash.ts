import { AnchorProvider, setProvider } from "@coral-xyz/anchor";
import { Connection, PublicKey, SystemProgram, Transaction, TransactionInstruction, clusterApiUrl } from "@solana/web3.js";
import { anchorProgram, signAndSendTransaction } from "./coral";
import { providerPhantomWallet } from "./WalletProvider";

const connection = new Connection("http://127.0.0.1:8899", "confirmed");
// const connection = new Connection(clusterApiUrl('devnet'), "finalized");

const createTxh = async (txInstruction: TransactionInstruction, userPublickey: PublicKey) => {
    try {
        alert(`Your asset account opening`);
        const transaction = new Transaction().add(txInstruction);
        await signAndSendTransaction(transaction, userPublickey, "Your asset account opened successful");

    } catch (error) {
        console.log("Error Open Assets Cash: ", error);
    }
}

const openAsset = (publicKey: string, walletName: string, pda: PublicKey) => {
    if (publicKey !== undefined) {
        const userPublickey = new PublicKey(publicKey);
        if (walletName) {
            if (walletName === 'Phantom') {
                setProvider(new AnchorProvider(connection, providerPhantomWallet, {
                    preflightCommitment: "processed"
                }));
            }
        }

        anchorProgram()
            .then(async (program) => {
                if (program) {
                    const txInstruction = await program.methods
                        .initUser()
                        .accounts({
                            client: pda,
                            signer: userPublickey,
                            systemProgram: SystemProgram.programId
                        })
                        .instruction();
                    createTxh(txInstruction, userPublickey);
                }
            })
            .catch((error) => {
                console.error("Error setting program: ", error);
            })
    }
}

const closeAsset = () => {
    // if (publicKey !== undefined) {
    //     const userPublickey = new PublicKey(publicKey);
    //     if (walletName) {
    //         if (walletName === 'Phantom') {
    //             setProvider(new AnchorProvider(connection, providerPhantomWallet, {
    //                 preflightCommitment: "processed"
    //             }));
    //         }
    //     }

    //     anchorProgram()
    //         .then((program) => {
    //             if (program) {
    //                 createTxh(program, pda, userPublickey);
    //             }
    //         })
    //         .catch((error) => {
    //             console.error("Error setting program: ", error);
    //         })
    // }
}


export { openAsset };