import { WalletExtensionName } from '../constants/constant';
import {
    Action,
    CmdPublickey,
    WalletPublickey
} from './constants';

// export const updatePhantomPubkey = (payload: CmdPublickey): Action => ({
//     type: 'UPDATE_PHANTOM_PUBLIC_KEY',
//     payload: payload
// })

export type TypeUpdateWallet = {
    publicKey: string,
    type: WalletExtensionName,
}

export const updateWallet = (payload: WalletPublickey) => ({
    type: "UPDATE_PUBLICKEY",
    payload,
});

// export const sum = (payload: TwoNumber) => ({
//     type: SUM,
//     payload
// })