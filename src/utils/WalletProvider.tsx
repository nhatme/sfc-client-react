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

// const getBackpackProvider = () => {
//     const provider = (window as any).backpack;
//     if (provider?.isBackpack) {
//         return {
//             detect: provider?.isBackpack,
//             provider: provider
//         }
//     }
// }

const providerPhantomWallet = getPhantomProvider()?.provider;
const detectPhantom = getPhantomProvider()?.detect;
const providerSolflareWallet = getSolflareProvider()?.provider;
const detectSolflare = getSolflareProvider()?.detect;
// const detetcBackpack = getBackpackProvider()?.detect;
// const providerBackpackWallet = getBackpackProvider()?.provider;

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

export {
    detectSolflare,
    detectPhantom,
    connectWallet,
    disConnect,
    providerPhantomWallet,
    providerSolflareWallet,
}