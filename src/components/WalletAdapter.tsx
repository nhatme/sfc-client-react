import { useEffect, useState } from "react";

// const [detectPhantom, setDetectPhantom] = useState<any>(null);
const getProvider = () => {
    const isPhantomInstalled = (window as any).phantom?.solana?.isPhantom
    if (isPhantomInstalled) {
        console.log(isPhantomInstalled);
        window.open('https://phantom.app/', '_blank');
    }
};

const WalletAdapter = () => {
    useEffect(() => {
        console.log("useEffect times1");
        getProvider();
    }, []);
    return (
        <div>WalletAdapter</div>
    )
}

export default WalletAdapter