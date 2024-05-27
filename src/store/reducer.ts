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
    tokenAccount: false,
    assetAccount: false,
    walletBalance: {
        sol: 0,
        sfc: 0,
        asset: 0
    },
    buyAndSellSol: {
        type: "unknown",
        amount: 0,
        isTarget: false
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
            const { amount: transferAmount, type: transferType, mode: transferMode } = action.payload;
            return {
                ...state,
                transfers: { amount: transferAmount, type: transferType, mode: transferMode }
            }
        case "UPDATE_TOKEN_ACCOUNT":
            return {
                ...state,
                tokenAccount: action.payload.openTokenAcc,
            }
        case "UPDATE_ASSET_ACCOUNT":
            return {
                ...state,
                assetAccount: action.payload.openAssetAcc
            }
        case "UPDATE_BALANCE":
            const { sol, sfc, asset } = action.payload;
            return {
                ...state,
                walletBalance: { sol: sol, sfc: sfc, asset: asset }
            }
        case "UPDATE_BUY_SELL_SOL":
            const { type: buySellType, amount: buySellAmount, isTarget: buySellIsTarget } = action.payload;
            return {
                ...state,
                buyAndSellSol: { type: buySellType, amount: buySellAmount, isTarget: buySellIsTarget }
            }
        default:
            return state;
    }
};

export default reducer;