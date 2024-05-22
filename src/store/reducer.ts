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
    },
    listToken: [
        {
            mintAddress: "",
            balance: 0,
            tokenName: '',
            tokenSymbol: '',
            tokenImg: ''

        },

    ]
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
            const { amount, type, mode } = action.payload;
            return {
                ...state,
                transfers: {
                    amount: amount,
                    type: type,
                    mode: mode
                }
            }
        case "UPDATE_BALANCE_TOKEN_WALLET":
            const { mintAddress, balance, tokenName, tokenSymbol, tokenImg } = action.payload;
            return {
                ...state,
                listToken: [
                    ...state.listToken,
                    { mintAddress, balance, tokenName, tokenSymbol, tokenImg }
                ]

            }
        default:
            return state;
    }
};

export default reducer;