import { WalletWatching, WalletPrevious, WalletExtensionName } from "../constants/constant";

function initWalletLocalStorage(walletName: WalletExtensionName, walletWatching: WalletWatching, walletPrevious: WalletPrevious): void {
    const getWalletWatching = localStorage.getItem(walletWatching);
    const getWalletPrevious = localStorage.getItem(walletPrevious);
    !getWalletWatching ? localStorage.setItem(walletWatching, walletName) : localStorage.setItem(walletWatching, walletName);
    if (!getWalletPrevious) {
        localStorage.setItem(walletPrevious, JSON.stringify([walletName]));
    } else {
        const walletPreviousArr = JSON.parse(getWalletPrevious);
        if (!walletPreviousArr.includes(walletName)) {
            walletPreviousArr.push(walletName);
            localStorage.setItem(walletPrevious, JSON.stringify(walletPreviousArr));
        }
    }
}

function removeItemLocalStorage() {
    const getWalletWatching = localStorage.getItem("WALLET_EXTENSION_WATCHING");
    if (getWalletWatching) {
        localStorage.removeItem("WALLET_EXTENSION_WATCHING");
    }
}

export { initWalletLocalStorage, removeItemLocalStorage };