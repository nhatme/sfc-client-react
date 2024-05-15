export type WalletName = "Phantom" | "Solflare" | "Backpack" | "Unknown";

export interface State {
    myPublicKey: {
        publicKey: string | undefined,
        walletType: WalletName
    };
    publicKeyTarget: string | undefined
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

export type Action = UpdatePublickeyAction | UpdatePublickeyTargetAction; 