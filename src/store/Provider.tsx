import { FC, useReducer } from 'react';
import WalletContext from './Context';
import reducer, { initState } from './reducer';

const Provider: FC<{ children: JSX.Element }> = ({ children }) => {
    const [state, dispatch] = useReducer(reducer, initState);

    return (
        <WalletContext.Provider value={{ state, dispatch }}>
            {children}
        </WalletContext.Provider>
    );
}

export default Provider;
