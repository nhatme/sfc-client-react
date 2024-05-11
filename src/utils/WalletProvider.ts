import Solflare from "@solflare-wallet/sdk";
import { useEffect, useState } from "react";
import { initWalletLocalStorage, removeItemLocalStorage } from "./ManageLocalStorage";

const getPhantomProvider = () => {
    if ('phantom' in window) {
        const provider = (window as any).phantom?.solana;
        if (provider?.isPhantom) {
            return {
                detect: provider?.isPhantom,
                provider: provider
            };
        }
    }
    window.open('https://phantom.app/', '_blank');
};

const getOkxProvider = () => {
    const provider = (window as any).okxwallet;
    if (typeof provider !== 'undefined') {
        return {
            detect: provider.isOkxWallet,
            provider: provider.solana
        };
    }
    window.open('https://www.okx.com/web3/', '_blank');
}

const detectSolflare = async () => {
    const providerSolflare = new Solflare();
    return {
        detect: await providerSolflare.detectWallet(),
        provider: providerSolflare
    };
}

const providerPhantomWallet = getPhantomProvider()?.provider;
const providerOkx = getOkxProvider()?.provider;

interface DetectionResult {
    provider: Solflare,
    detect: boolean
}
let providerSolflare: DetectionResult | null = null;

detectSolflare()
    .then(({ provider, detect }) => {
        providerSolflare = {
            detect: detect,
            provider: provider
        }
    })
    .catch((err) => {
        console.log(err);
    });

const connectPhantom = async () => {
    try {
        const res = await providerPhantomWallet.connect();
    } catch (error) {
        console.log(error);
    }
}

const disConnect = async () => {
    try {
        await providerPhantomWallet.disconnect();
    } catch (error) {
        console.log(error);
    }
}

const connectOkx = async () => {
    try {
        const res = await providerOkx.connect();
    } catch (error) {
        console.log(error);
    }
}

const connectSolflare = async () => {
    try {
        const res = await providerSolflare?.provider.connect();
    } catch (error) {
        console.error(error);
    }
}

const useWalletStates = () => {
    const [phantomStatePublickey, setPhantomPublickey] = useState<any>(null);
    const [okxStatePublickey, setOkxPublickey] = useState<any>(null);
    const [solflareStatePublickey, setSolflarePublickey] = useState<any>(null);

    useEffect(() => {
        providerPhantomWallet.on("connect", (publicKey: string) => {
            setPhantomPublickey(publicKey.toString());
            initWalletLocalStorage("Phantom", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
        });
        providerPhantomWallet.on("disconnect", () => {
            setPhantomPublickey(null);
            removeItemLocalStorage();
            console.log("phantom diconnected");
        });
        providerPhantomWallet.on("accountChanged", (publicKey: string) => {
            if (publicKey) {
                setPhantomPublickey(publicKey.toString());
            }
        })
        providerOkx.on("connect", (publicKey: string) => {
            setOkxPublickey(publicKey.toString());
            initWalletLocalStorage("Okx", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
        })
        providerOkx.on("disconnect", () => {
            setOkxPublickey(null);
            removeItemLocalStorage();
            console.log("okx diconnected");
        })
        providerOkx.on("accountChanged", (publicKey: string) => {
            if (publicKey) {
                setOkxPublickey(publicKey.toString());
            }
        })
        providerSolflare?.provider.on('connect', (publicKey: string) => {
            initWalletLocalStorage("Solflare", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
            setSolflarePublickey(publicKey.toString());
        });
        providerSolflare?.provider.on('disconnect', () => {
            setSolflarePublickey(null);
            removeItemLocalStorage();
            console.log("Solflare disconnected");

        });

    }, [providerPhantomWallet, providerOkx, providerSolflare?.provider])

    return {
        phantomStatePublickey,
        okxStatePublickey,
        solflareStatePublickey,
    };
}

export {
    connectPhantom,
    connectOkx,
    connectSolflare,
    disConnect,
    useWalletStates,
    providerPhantomWallet,
    providerOkx,
    providerSolflare,
}