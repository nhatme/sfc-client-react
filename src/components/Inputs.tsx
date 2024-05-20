import { ChangeEvent, FC, useEffect, useState } from "react";
import { InputCustomProps } from "../interfaces/CustomProps";
import { ButtonBuilder } from "./Button";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import { useWallet } from "../hooks/useWallet";
import { lockTargetAddress } from "../utils/LockTargetAddress";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { PublicKey } from "@solana/web3.js";
import { fetchPDA } from "../utils/coral";
import { ActionHandleButton } from "../constants/constant";
import { burnTokenSFC, burnTokenSFCTarget, mintTokenFromAsset, mintTokenSFCTarget } from "../utils/MintAndBurn";
import { Web3Dialog } from "./Dialog";

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
    const userPublickey = state.myPublicKey.publicKey;
    const walletType = state.myPublicKey.walletType;

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

    useEffect(() => {
        const connectAndLock = async () => {
            if (buttonClicked && targetAddress && userPublickey && walletType) {
                if (!phantomAdapter.connected) {
                    await phantomAdapter.connect();
                }
                const [pda, num] = fetchPDA(new PublicKey(userPublickey), "target");
                if (pda instanceof PublicKey) {
                    lockTargetAddress(userPublickey, targetAddress, walletType, pda);
                } else {
                    console.log("PDA is not a publickey format");
                }
                // console.log(pda.toString());
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
            {userPublickey ? (
                <ButtonBuilder
                    onClick={handleButtonClick}
                    btnType="circle" sizeVariant="small" paddingSize="Medium" btnName="Confirm change?"
                    classNameCustom="text-white bg-purple-500" border="gray-border" cursor="pointer" />
            ) : <div>
                <Web3Dialog />
            </div>}
        </div>
    )
}

/**
 * This @FC for input quantity of token that user want to transfer or swap 
 * 
 * With w-full of input
*/
const InputQuantityMintBurn: FC = () => {
    const { state, dispatch } = useWallet();
    const [amount, setAmount] = useState<string>("0");
    const [action, setAction] = useState<ActionHandleButton | null>(null);
    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;

    const typeAction = state.mintAndBurn.type;
    const isTarget = state.mintAndBurn.isTarget;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue == '') {
            setAmount("0");
            return;
        }
        // Regex to match non-numeric characters
        const regex = /[^0-9]/g;
        // Remove non-numeric characters
        const sanitizedValue = inputValue.replace(regex, '');
        setAmount(sanitizedValue);
    };

    const handleClickMintBurn = () => {
        if (amount === "0") {
            return;
        }
        setAction(typeAction);
    }

    useEffect(() => {
        console.log("mint burn component", isTarget);
        console.log('action changed to:', action);
        const mintToken = async () => {
            if (userPublickey && walletName) {
                await mintTokenFromAsset(userPublickey, walletName, Number(amount));
            }
            setAction(null);
        }

        const burnToken = async () => {
            if (userPublickey && walletName) {
                await burnTokenSFC(userPublickey, walletName, Number(amount));
            }
            setAction(null);
        }

        const mintTokenTarget = async () => {
            if (userPublickey && walletName) {
                await mintTokenSFCTarget(userPublickey, walletName, Number(amount));
            }
            setAction(null);
        }

        const burnTokenTarget = async () => {
            if (userPublickey && walletName) {
                await burnTokenSFCTarget(userPublickey, walletName, Number(amount));
            }
            setAction(null);
        }

        if (action === "mint" && isTarget == false) {
            mintToken();
        } else if (action === "burn" && isTarget == false) {
            burnToken();
        } else if (action === "mint" && isTarget == true) {
            mintTokenTarget();
            console.log("target is true so fucking mint");
        } else if (action === "burn" && isTarget == true) {
            burnTokenTarget();
            console.log("target is true so fucking burn");
        }
    }, [action, typeAction, isTarget, userPublickey, walletName]);

    return (
        <>
            {typeAction !== "unknown" && (
                <div>
                    <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                        <input
                            value={amount === "0" ? "" : amount}
                            onChange={handleInputChange}
                            type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~ 100,000 VND</div>
                    </div>
                    <ButtonBuilder
                        onClick={handleClickMintBurn}
                        btnType="circle-square" sizeVariant="large" paddingSize="Small"
                        classNameCustom={`mt-4px text-center text-white ${(amount === "0" || amount == "") ? "bg-purple-100" : "bg-purple-500 cursor-pointer"}`}
                        cursor="not-allowed"
                        btnName="Enter an amount" border="gray-border"
                    />
                </div>
            )}

        </>
    )
}

export { InputCustom, InputTargetAddress, InputQuantityMintBurn };