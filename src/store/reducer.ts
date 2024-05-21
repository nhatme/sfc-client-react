import { Action, State } from "./types";

export const initialState: State = {
    myPublicKey: {
        publicKey: undefined,
        walletType: "Unknown"
    },
    publicKeyTarget: "",
    mintAndBurn: {
        amount: 0,
        type: "unknown",
        isTarget: false
    },
    transfers: {
        amount: 0,
        type: "unknown",
        mode: "unknown"
    }
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
        case "UPDATE_AMOUNT_MINT_BURN":
            return {
                ...state,
                mintAndBurn: {
                    amount: action.payload.amount,
                    type: action.payload.type,
                    isTarget: action.payload.isTarget
                }
            }
        case "UPDATE_TRANSFERS":
            return {
                ...state,
                transfers: {
                    amount: action.payload.amount,
                    type: action.payload.type,
                    mode: action.payload.mode
                }
            }
        default:
            return state;
    }
};

export default reducer;