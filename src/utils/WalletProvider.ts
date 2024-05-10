import Solflare from "@solflare-wallet/sdk";
import { useEffect, useState } from "react";

const walletUsing = "WALLET_EXTENSION_WATCHING";
const walletPrevious = "open-wallet-previous";
const getLocalStore = localStorage.getItem(walletUsing);
const getLocalStorePrevious = localStorage.getItem(walletPrevious);
let walletPreviousArr: any[] = [];
if (!getLocalStore) {
    localStorage.setItem(walletPrevious, JSON.stringify(""));
}
if (!getLocalStorePrevious) {
    localStorage.setItem(walletUsing, JSON.stringify([]));
}

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
    }
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
        walletPreviousArr.push("Phantom");
        localStorage.setItem(walletPrevious, JSON.stringify(walletPreviousArr));
        localStorage.setItem(walletUsing, JSON.stringify("Phantom"));
    } catch (error) {
        console.log(error);
    }
}

const connectOkx = async () => {
    try {
        const res = await providerOkx.connect();
        walletPreviousArr.push("Okx");
        localStorage.setItem(walletPrevious, JSON.stringify(walletPreviousArr));
        localStorage.setItem(walletUsing, JSON.stringify("Okx"));
    } catch (error) {
        console.log(error);
    }
}

const connectSolflare = async () => {
    try {
        const res = await providerSolflare?.provider.connect();
        walletPreviousArr.push("Solflare");
        localStorage.setItem(walletPrevious, JSON.stringify(walletPreviousArr));
        localStorage.setItem(walletUsing, JSON.stringify("Solflare"));
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
        });
        providerPhantomWallet.on("disconnect", () => {
            setPhantomPublickey(null);
            localStorage.removeItem(walletUsing);
        });
        providerPhantomWallet.on("accountChanged", (publicKey: string) => {
            if (publicKey) {
                setPhantomPublickey(publicKey.toString());
            }
        })
        providerOkx.on("connect", (publicKey: string) => {
            setOkxPublickey(publicKey.toString());
        })
        providerOkx.on("disconnect", () => {
            setOkxPublickey(null);
            localStorage.removeItem(walletUsing);
        })
        providerOkx.on("accountChanged", (publicKey: string) => {
            if (publicKey) {
                setOkxPublickey(publicKey.toString());
            }
        })
        providerSolflare?.provider.on('connect', (publicKey: string) => {
            setSolflarePublickey(publicKey.toString());
        });
        providerSolflare?.provider.on('disconnect', () => {
            setSolflarePublickey(null);
            localStorage.removeItem(walletUsing);
        });

    }, [providerPhantomWallet, providerOkx, providerSolflare])

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
    useWalletStates,
    providerPhantomWallet,
    providerOkx,
    providerSolflare,
}