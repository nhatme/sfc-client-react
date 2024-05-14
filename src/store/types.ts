export type WalletName = "Phantom" | "Solflare" | "Backpack" | "Unknown";

export interface State {
    myPublicKey: {
        publicKey: string,
        walletType: WalletName
    };
    publicKeyTarget: string
}

interface UpdatePublickeyAction {
    type: 'UPDATE_PUBLICKEY_ACTION';
    payload: {
        publicKey: string,
        walletType: WalletName
    }
}

interface UpdatePublickeyTargetAction {
    type: 'UPDATE_PUBLICKEY_TARGET_ACTION';
    payload: {
        publicKey: string
    }
}

export type Action = UpdatePublickeyAction | UpdatePublickeyTargetAction; 