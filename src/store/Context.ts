import { createContext } from 'react';
import { WalletContextProps } from './constants';
import { initState } from './reducer';

const context: WalletContextProps = {
    state: initState,
    dispatch: () => { },
};

const WalletContext = createContext(context);

export default WalletContext;