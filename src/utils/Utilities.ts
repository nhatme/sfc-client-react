import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';
import anchor, { AnchorProvider, Program, Wallet, getProvider, setProvider } from '@coral-xyz/anchor';
import { useWallet } from '../hooks/useWallet';
import { useEffect, useState } from 'react';
import { providerPhantomWallet, providerSolflareWallet } from './WalletProvider';

const ProgramId = "F7TehQFrx3XkuMsLPcmKLz44UxTWWfyodNLSungdqoRX";
const connection = new Connection(clusterApiUrl('devnet'), "finalized");
const { state } = useWallet();

const useBalance = () => {
    const [balance, setBalance] = useState<number>(0);
    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const balance = await connection.getBalance(new PublicKey(state.myPublicKey.publicKey), "confirmed");
                setBalance(balance / LAMPORTS_PER_SOL);
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };
        if (state.myPublicKey.publicKey) {
            fetchBalance();
        }
    }, [state.myPublicKey.publicKey]);
    return balance;
}

const useLockTargetAddress = () => {
    const targetAddress = new PublicKey(state.publicKeyTarget);
    const [programTarget, setProgramTarget] = useState<Program | null>(null);
    const userWallet = {
        publickey: state.myPublicKey.publicKey,
        walletName: state.myPublicKey.walletType
    };

    useEffect(() => {
        if (!(programTarget instanceof Program)) {
            const wallet = anchor.Wallet.local();
            setProvider(new AnchorProvider(connection, wallet, {
                preflightCommitment: 'recent'
            }));
            Program.fetchIdl(ProgramId)
                .then((IDL) => {
                    if (!IDL) {
                        console.log("Error: IDL not found");
                    } else {
                        const programTarget = new Program(IDL, new PublicKey(ProgramId), getProvider());
                        setProgramTarget(programTarget);
                    }
                })
                .catch((err) => {
                    console.error("Error fetching IDL: ", err);
                })
        }
    }, [programTarget]);


    try {
        const [targetDataPDA] = PublicKey.findProgramAddressSync(
            [Buffer.from("target", "utf8"), new PublicKey(userWallet.publickey).toBuffer()],
            new PublicKey(ProgramId)
        );
    } catch (error) {

    }
}

export { useBalance, useLockTargetAddress };