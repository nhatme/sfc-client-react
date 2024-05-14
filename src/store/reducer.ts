import { Action, State } from "./types";

const initialState: State = {
    myPublicKey: {
        publicKey: "",
        walletType: "Unknown"
    },
    publicKeyTarget: ""
};

const reducer = (state: State, action: Action): State => {
    switch (action.type) {
        case "UPDATE_PUBLICKEY_ACTION":
            return {
                ...state,
                myPublicKey: {
                    publicKey: action.payload.publicKey,
                    walletType: action.payload.walletType
                },
            };
        case "UPDATE_PUBLICKEY_TARGET_ACTION":
            return {
                ...state,
                publicKeyTarget: action.payload.publicKey
            }
        default:
            return state;
    }
};

export { initialState };
export default reducer;