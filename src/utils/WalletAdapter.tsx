import { FC, useState } from "react";

const getPhantomProvider = () => {
    if ('phantom' in window) {
        const provider = (window as any).phantom?.solana;
        if (provider?.isPhantom) {
            return provider;
        }
    }
    window.open('https://phantom.app/', '_blank');
};

const getOkxProvider = () => {
    if (typeof (window as any).okxwallet !== 'undefined') { console.log('OKX is installed!'); }
}

const WalletAdapter = (): [[string, boolean], () => Promise<void>] => {
    const [phantomState, setPhantomWallet] = useState<[string, boolean]>(["", false]);
    const [okxState, setOkxWallet] = useState<[string, boolean]>(["", false]);

    const connectPhantom = async () => {
        const provider = getPhantomProvider();
        try {
            const res = await provider.request({ method: "connect" });
            setPhantomWallet(prevState => [
                res.publicKey.toString(),
                true
            ]);
        } catch (error) {
            console.log(error);
        }
    }

    const connectOkx = async () => {
        const provider = getOkxProvider();
        try {
        } catch (error) {
            
        }
    }

    return [phantomState, connectPhantom]
}

export { WalletAdapter }