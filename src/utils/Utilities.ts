import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { useWallet } from '../hooks/useWallet';
import { useEffect, useState } from 'react';

const connection = new Connection(clusterApiUrl('devnet'), "finalized");

const useBalance = () => {
    const { state } = useWallet();
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

export { useBalance };