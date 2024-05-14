import { providerPhantomWallet, providerSolflareWallet } from "./WalletProvider";

const PhantomWallet = {
    publicKey: providerPhantomWallet.publicKey,
    signTransaction: providerPhantomWallet.signTransaction.bind(providerPhantomWallet),
    signAllTransactions: providerPhantomWallet.signAllTransactions.bind(providerPhantomWallet),
}

const SolflareWallet = {
    publicKey: providerSolflareWallet.publicKey,
    signTransaction: providerSolflareWallet.signTransaction.bind(providerSolflareWallet),
    signAllTransactions: providerSolflareWallet.signAllTransactions.bind(providerSolflareWallet)
}

export { PhantomWallet, SolflareWallet };