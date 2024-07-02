import { ActionHandleButton, ModeTransfer } from "../constants/constant";

export type WalletName = "Phantom" | "Solflare" | "Backpack" | "Unknown";
export type Trading = "buy" | "sell";

export interface State {
    myPublicKey: {
        publicKey: string | undefined,
        walletType: WalletName
    };
    publicKeyTarget: string | undefined;
    mintAndBurn: {
        amount: number,
        type: ActionHandleButton,
        isTarget: boolean
    };
    transfers: {
        amount: number,
        type: ActionHandleButton,
        mode: ModeTransfer
    };
    tokenAccount: boolean;
    assetAccount: boolean;
    walletBalance: {
        sol: number,
        sfc: number,
        asset: number
    };
    buyAndSellSol: {
        type: Trading,
        amount: number,
        isTarget: boolean
    },
    liquidPool: {
        poolSOL: number,
        poolSFC: number,
        LPtokenSupply: number,
        currentSOL: number,
        currentSFC: number
    },
    liquidPoolRealtime: {
        poolSOL: number,
        poolSFC: number,
        LPtokenSupply: number,
    }
}

interface UpdatePublickeyAction {
    type: 'UPDATE_PUBLICKEY_ACTION';
    payload: {
        publicKey: string | undefined,
        walletType: WalletName
    }
}

interface UpdatePublickeyTargetAction {
    type: 'UPDATE_PUBLICKEY_TARGET_ACTION';
    payload: {
        publicKey: string | undefined
    }
}

interface UpdateAmountMintAndBurn {
    type: 'UPDATE_AMOUNT_MINT_BURN';
    payload: {
        amount: number,
        type: ActionHandleButton,
        isTarget: boolean
    }
}

interface UpdateTransfers {
    type: 'UPDATE_TRANSFERS';
    payload: {
        amount: number,
        type: ActionHandleButton,
        mode: ModeTransfer
    }
}

interface UpdateTokenAccount {
    type: "UPDATE_TOKEN_ACCOUNT",
    payload: {
        openTokenAcc: boolean
    }
}

interface UpdateAssetAccount {
    type: "UPDATE_ASSET_ACCOUNT",
    payload: {
        openAssetAcc: boolean
    }
}

interface UpdateBalance {
    type: "UPDATE_BALANCE",
    payload: {
        sol: number,
        sfc: number,
        asset: number
    }
}

interface UpdateBuyAndSellSol {
    type: "UPDATE_BUY_SELL_SOL",
    payload: {
        type: Trading,
        amount: number,
        isTarget: boolean
    }
}

// only for initial
interface UpdateLiquidPool {
    type: "UPDATE_LIQUID_POOL",
    payload: {
        poolSOL: number,
        poolSFC: number,
        LPtokenSupply: number,
        currentSOL: number,
        currentSFC: number
    }
}

interface UpdateLiquidPoolRealtime {
    type: "UPDATE_LIQUID_REALTIME",
    payload: {
        poolSOL: number,
        poolSFC: number,
        LPtokenSupply: number,
    }
}

export type Action =
    | UpdatePublickeyAction
    | UpdatePublickeyTargetAction
    | UpdateAmountMintAndBurn
    | UpdateTransfers
    | UpdateTokenAccount
    | UpdateAssetAccount
    | UpdateBalance
    | UpdateBuyAndSellSol
    | UpdateLiquidPool
    | UpdateLiquidPoolRealtime;