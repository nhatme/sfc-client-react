import { TypeUpdateWallet } from './actions';
import { Action, WalletPublickey, } from './constants';

const initState: WalletPublickey = {
    publicKey: "",
    type: "",
};

// const reducer = (state: WalletPublickey, action: Action): WalletPublickey => {
//     switch (action.type) {
//         case "UPDATE_PUBLICKEY":
//             return {
//                 ...state,
//                 publicKey: action.payload.publicKey,
//                 type: action.payload.type
//             };
//         case 'LOGIN':
//             return {
//                 ...state,
//                 isLogin: action.payload.isLogin
//             }
//         default:
//             return state;
//     }
// };
type ActionType = {
    type: string,
    payload: TypeUpdateWallet
}

const reducer = (state: WalletPublickey, action: ActionType) => {
    switch (action.type) {
        case "UPDATE_PUBLICKEY":
            return {
                ...state,
                publicKey: action.payload.publicKey,
                type: action.payload.type
            };
        default:
            return state;
    }
};

export { initState };
export default reducer;
