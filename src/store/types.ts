import { ActionHandleButton, ModeTransfer } from "../constants/constant";

export type WalletName = "Phantom" | "Solflare" | "Backpack" | "Unknown";

export interface Token {
    mintAddress: string,
    balance: number;
    tokenName: string;
    tokenSymbol: string;
    tokenImg: string;
}

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
    listToken: Token[];
}

export interface UpdatePublickeyAction {
    type: 'UPDATE_PUBLICKEY_ACTION';
    payload: {
        publicKey: string | undefined,
        walletType: WalletName
    }
}

export interface UpdatePublickeyTargetAction {
    type: 'UPDATE_PUBLICKEY_TARGET_ACTION';
    payload: {
        publicKey: string | undefined
    }
}

export interface UpdateAmountMintAndBurn {
    type: 'UPDATE_AMOUNT_MINT_BURN';
    payload: {
        amount: number,
        type: ActionHandleButton,
        isTarget: boolean
    }
}

export interface UpdateTransfers {
    type: 'UPDATE_TRANSFERS';
    payload: {
        amount: number,
        type: ActionHandleButton,
        mode: ModeTransfer
    }
}

export interface UpdateSFCbalance {
    type: "UPDATE_BALANCE_TOKEN_WALLET",
    payload: {
        mintAddress: string,
        balance: number,
        tokenName: string,
        tokenSymbol: string,
        tokenImg: string
    }
}

export type Action = UpdatePublickeyAction | UpdatePublickeyTargetAction | UpdateAmountMintAndBurn | UpdateTransfers | UpdateSFCbalance; 