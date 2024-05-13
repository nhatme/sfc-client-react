import { useContext } from 'react';
import { WalletStoreContext } from '../store';

const useWallet = () => useContext(WalletStoreContext);

export { useWallet };
