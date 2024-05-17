import { ChangeEvent, FC, useCallback, useEffect, useState } from "react";
import { InputCustomProps } from "../interfaces/CustomProps";
import { ButtonBuilder } from "./Button";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import { useWallet } from "../hooks/useWallet";
import { lockTargetAddress } from "../utils/LockTargetAddress";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { PublicKey } from "@solana/web3.js";
import { fetchPDA } from "../utils/coral";


const InputCustom: FC<InputCustomProps> = ({ className, label, dropdown, unitCurrencyConverter, walletBalance, placeHolder, type, inputClassName }) => {
    return (
        <div className={`${className}`}>
            <label htmlFor="">{label}</label>
            <div className="flex justify-between items-center">
                <input spellCheck={false} type={type} placeholder={placeHolder} className={`${inputClassName} leading-none outline-none mt-2 text-black w-full`} />
                <div>
                    {dropdown}
                </div>
            </div>
            <div className="flex justify-between mt-2">
                <div>{unitCurrencyConverter}</div>
                <div className="text-gray-500">{walletBalance}</div>
            </div>
        </div>
    )
}

/** 
 * This @FC for input target address when user want to target a specific target address (public key ) 
 * */
const InputTargetAddress: FC = () => {
    const { state, dispatch } = useWallet();
    const [targetAddress, setTargetAddress] = useState<string>("");
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const phantomAdapter = new PhantomWalletAdapter();

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        setTargetAddress(event.target.value);
    };

    const handleButtonClick = () => {
        setButtonClicked(true);
        dispatch({
            type: 'UPDATE_PUBLICKEY_TARGET_ACTION',
            payload: { publicKey: targetAddress },
        });
    };

    const userPublickey = state.myPublicKey.publicKey;
    const walletType = state.myPublicKey.walletType;

    useEffect(() => {
        const connectAndLock = async () => {
            if (buttonClicked && targetAddress && userPublickey && walletType) {
                if (!phantomAdapter.connected) {
                    await phantomAdapter.connect();
                }
                lockTargetAddress(userPublickey, targetAddress, walletType);
                const [pda, num] = fetchPDA(new PublicKey(userPublickey));
                console.log(pda.toString());
                
            }
        };

        connectAndLock();
        setButtonClicked(false);
    }, [buttonClicked, targetAddress, userPublickey, walletType]);

    return (
        <div className="flex gap-4px items-center">
            <div className="flex gap-6px items-center bg-white rounded-custom-md border-gray-border border-1 px-16px py-8px shadow-md">
                <div>
                    <input value={targetAddress}
                        onChange={handleInputChange}
                        className="text-fs-20 leading-lh-100 font-bold italic outline-none text-purple-500" spellCheck="false" type="text" placeholder="type or paste here..." />
                </div>
                <ClipboardDocumentListIcon className="h-6 w-6 text-purple-500 hover:cursor-pointer" />
            </div>
            <ButtonBuilder
                onClick={handleButtonClick}
                btnType="circle" sizeVariant="small" paddingSize="Medium" btnName="Confirm change?"
                classNameCustom="text-white bg-purple-500" border="gray-border" cursor="pointer" />
        </div>
    )
}

/**
 * This @FC for input quantity of token that user want to transfer or swap 
 * 
 * With w-full of input
*/
const InputQuantity: FC = () => {
    return (
        <div>
            <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                <input type="number" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                <div className="text-fs-12 font-medium text-gray-200 text-right">~ 100,000 VND</div>
            </div>
            <ButtonBuilder
                btnType="circle-square" sizeVariant="large" paddingSize="Small"
                classNameCustom="mt-4px text-center text-white bg-purple-100"
                btnName="Enter an amount" border="gray-border"
            />
        </div>
    )
}

export { InputCustom, InputTargetAddress, InputQuantity };