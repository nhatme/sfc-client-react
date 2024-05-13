import { Connection, LAMPORTS_PER_SOL, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { FC, useEffect, useState } from 'react';
import { useWallet } from '../hooks/useWallet';

const connection = new Connection(clusterApiUrl('devnet'), "confirmed");

const GetBalance: FC = () => {
    const [balance, setBalance] = useState<number>(0);
    const { state, dispatch } = useWallet();
    console.log("nhatutil", state);

    useEffect(() => {
        const fetchBalance = async () => {
            try {
                const balance = await connection.getBalance(new PublicKey(state.publicKey), "confirmed");
                setBalance(balance); // Setting balance using setBalance
            } catch (error) {
                console.error("Error fetching balance:", error);
            }
        };

        if (state.publicKey) {
            fetchBalance();
        }
    }, [state.publicKey]);
    return (
        <div>
            <h1>
                Balance of nhatdeptrai: {balance / LAMPORTS_PER_SOL} SOL
            </h1>
        </div>
    )
}

export { GetBalance };