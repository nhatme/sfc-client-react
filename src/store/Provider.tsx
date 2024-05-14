import { FC, ReactNode, useReducer } from 'react';
import WalletContext from './Context';
import reducer, { initialState } from './reducer';

const Provider: FC<{ children: ReactNode }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initialState);

    return (
        <WalletContext.Provider value={{ state, dispatch }}>
            {children}
        </WalletContext.Provider>
    );
}

export default Provider;