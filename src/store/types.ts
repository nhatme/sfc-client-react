import { ActionHandleButton, ModeTransfer } from "../constants/constant";

export type WalletName = "Phantom" | "Solflare" | "Backpack" | "Unknown";

export interface State {
    myPublicKey: {
        publicKey: string | undefined,
        walletType: WalletName
    };
    publicKeyTarget: string | undefined,
    mintAndBurn: {
        amount: number,
        type: ActionHandleButton,
        isTarget: boolean
    },
    transfers: {
        amount: number,
        type: ActionHandleButton,
        mode: ModeTransfer
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

export type Action = UpdatePublickeyAction | UpdatePublickeyTargetAction | UpdateAmountMintAndBurn | UpdateTransfers; 