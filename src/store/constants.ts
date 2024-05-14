import { Dispatch } from "react";
import { WalletExtensionName } from "../constants/constant";

export type CmdPublickey = "UPDATE_PUBLICKEY";

export type Action = {
    type: CmdPublickey;
    payload: { publicKey: string, type: WalletExtensionName },
}

export interface WalletPublickey {
    publicKey: string,
    type: WalletExtensionName,
}

export interface WalletContextProps {
    state: WalletPublickey,
    dispatch: Dispatch<Action>,
}

