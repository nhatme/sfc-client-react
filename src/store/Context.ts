import { Dispatch, createContext } from 'react';
import { State, Action } from './types';
import { initialState } from './reducer';

export interface WalletContextStoreProps {
    state: State,
    dispatch: Dispatch<Action>,
};

const walletStore: WalletContextStoreProps = {
    state: initialState,
    dispatch: () => { }
}

const WalletContext = createContext<WalletContextStoreProps>(walletStore);
export default WalletContext;