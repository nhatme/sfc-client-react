import { useContext } from 'react';
import WalletContext from '../store/Context';

const useWallet = () => useContext(WalletContext);

export { useWallet };
