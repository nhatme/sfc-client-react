import { FC, createContext, useState } from "react";
import { WalletContextProps } from "../interfaces/CustomProps";

const getPhantomProvider = () => {
    const provider = (window as any).phantom?.solana;
    if (provider?.isPhantom) {
        return {
            detect: provider?.isPhantom,
            provider: provider
        };
    }
};

const getSolflareProvider = () => {
    const provider = (window as any).solflare;
    if (provider?.isSolflare) {
        return {
            detect: provider?.isSolflare,
            provider: provider
        };
    }
}

const providerPhantomWallet = getPhantomProvider()?.provider;
const detectPhantom = getPhantomProvider()?.detect;
const providerSolflareWallet = getSolflareProvider()?.provider;
const detectSolflare = getSolflareProvider()?.detect;

const connectWallet = async (provider: any) => {
    try {
        return await provider?.connect();
    } catch (error) {
        return error;
    }
}

const disConnect = async (provider: any) => {
    try {
        return await provider.disconnect();
    } catch (error) {
        return error;
    }
}

const walletContextValue: WalletContextProps = {
    phantomStatePublickey: null,
    setPhantomPublickey: () => { },
    solflareStatePublickey: null,
    setSolflarePublickey: () => { }
};

const PublicKeyContext = createContext(walletContextValue);

const PublickeyProvider: FC<{ children: JSX.Element }> = ({ children }) => {
    const [phantomStatePublickey, setPhantomPublickey] = useState<any>(null);
    const [solflareStatePublickey, setSolflarePublickey] = useState<any>(null);

    return (
        <PublicKeyContext.Provider
            value={{
                phantomStatePublickey,
                setPhantomPublickey,
                solflareStatePublickey,
                setSolflarePublickey
            }}>
            {children}
        </PublicKeyContext.Provider>
    );
}

export {
    detectSolflare,
    detectPhantom,
    connectWallet,
    disConnect,
    providerPhantomWallet,
    providerSolflareWallet,
    PublicKeyContext,
    PublickeyProvider
}