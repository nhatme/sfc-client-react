import { FC, useEffect, useState } from "react";

const getProvider = () => {
    if ('phantom' in window) {
        const provider = (window as any).phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};

const SolanaWalletAdapter: FC = () => {
    const provider = getProvider();
    return (
        <>
            <div> WalletAdapter: {provider.isPhantom.toString()} </div>
        </>
    )
}

export { SolanaWalletAdapter, getProvider }