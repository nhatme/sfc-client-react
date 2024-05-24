import { ChangeEvent, FC, useEffect, useState } from "react";
import { InputCustomProps } from "../interfaces/CustomProps";
import { ButtonBuilder } from "./Button";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import { useWallet } from "../hooks/useWallet";
import { lockTargetAddress } from "../utils/LockTargetAddress";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { PublicKey } from "@solana/web3.js";
import { fetchPDA } from "../utils/coral";
import { ActionHandleButton, ModeTransfer } from "../constants/constant";
import { burnTokenSFCandTarget, mintTokenFromAsset, mintTokenSFCTarget } from "../utils/MintAndBurn";
import { Web3Dialog } from "./Dialog";
import { transferAssets, transferSFCtoken } from "../utils/Transfer";
import { SFCprice } from "../config/programConfig";
import { formatConverter } from "../utils/Utilities";
import { Bounce, ToastContainer } from "react-toastify";
import { notifyError, notifyProcess, notifySuccess } from "../notification/ToastMessage";

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
const InputQtyMintBurn: FC = () => {
    const { state } = useWallet();
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
        // Regex to match non-numeric characters except for the decimal point
        const regex = /[^0-9.]/g;
        // Remove non-numeric characters except for the decimal point
        let sanitizedValue = inputValue.replace(regex, '');
        // Ensure there is only one decimal point
        const decimalCount = (sanitizedValue.match(/\./g) || []).length;
        if (decimalCount > 1) {
            sanitizedValue = sanitizedValue.replace(/\.+$/, '');
        }
        setAmount(sanitizedValue);
    };

    const handleClickMintBurn = () => {
        if (amount === "0") {
            return;
        }
        setAction(typeAction);
    }

    useEffect(() => {
        // console.log("mint burn component", isTarget);
        // console.log('action changed to:', action);
        const mintToken = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await mintTokenFromAsset(userPublickey, walletName, Number(amount));
                    notifySuccess(<a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer</a >);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        notifyError(<span>Transaction failed: {error.message}</span>);
                    } else {
                        notifyError(<span>Transaction failed: Unknown error occurred</span>);
                    }
                }
            }
            setAction(null);
        }

        const burnToken = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await burnTokenSFCandTarget(userPublickey, walletName, Number(amount), isTarget);
                    notifySuccess(<a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer</a >);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        notifyError(<span>Transaction failed: {error.message}</span>);
                    } else {
                        notifyError(<span>Transaction failed: Unknown error occurred</span>);
                    }
                }
            }
            setAction(null);
        }

        const mintTokenTarget = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await mintTokenSFCTarget(userPublickey, walletName, Number(amount));
                    notifySuccess(<a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer</a >);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        notifyError(<span>Transaction failed: {error.message}</span>);
                    } else {
                        notifyError(<span>Transaction failed: Unknown error occurred</span>);
                    }
                }
            }
            setAction(null);
        }

        const burnTokenTarget = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await burnTokenSFCandTarget(userPublickey, walletName, Number(amount), isTarget, typeAction);
                    notifySuccess(<a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer</a >);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        notifyError(<span>Transaction failed: {error.message}</span>);
                    } else {
                        notifyError(<span>Transaction failed: Unknown error occurred</span>);
                    }
                }
            }
            setAction(null);
        }

        if (action === "mint" && isTarget == false) {
            mintToken();
        } else if (action === "burn" && isTarget == false) {
            burnToken();
        } else if (action === "mint" && isTarget == true) {
            mintTokenTarget();
        } else if (action === "burn" && isTarget == true) {
            burnTokenTarget();
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
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~ {amount && formatConverter(Number(amount) * SFCprice)} VND</div>
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
            <ToastContainer
                position="bottom-left"
                autoClose={5000}
                hideProgressBar={true}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}

const InputQtyTransfer: FC = () => {
    const { state } = useWallet();
    const [amount, setAmount] = useState<string>("0");
    const [switchState, setStateSwitch] = useState<ModeTransfer>("unknown");
    const [convertMoney, setConvertMoney] = useState<string>("");
    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const typeAction = state.transfers.type;
    const switchMode = state.transfers.mode;

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue == '') {
            setAmount("0");
            setConvertMoney("");
            return;
        }
        // Regex to match non-numeric characters except for the decimal point
        const regex = /[^0-9.]/g;
        // Remove non-numeric characters except for the decimal point
        let sanitizedValue = inputValue.replace(regex, '');
        // Ensure there is only one decimal point
        const decimalCount = (sanitizedValue.match(/\./g) || []).length;
        if (decimalCount > 1) {
            sanitizedValue = sanitizedValue.replace(/\.+$/, '');
        }
        setAmount(sanitizedValue);

        // Update convertMoney whenever amount changes
        const numericValue = parseFloat(sanitizedValue);
        if (!isNaN(numericValue)) {
            setConvertMoney(convertAmount(numericValue, switchMode));
        } else {
            setConvertMoney("");
        }
    };

    const handleClickTransfer = () => {
        if (amount === "0") return;
        setStateSwitch(switchMode);
    }

    useEffect(() => {
        const transferAsset = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await transferAssets(userPublickey, walletName, Number(amount));
                    notifySuccess(<a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer</a >);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        notifyError(<span>Transaction failed: {error.message}</span>);
                    } else {
                        notifyError(<span>Transaction failed: Unknown error occurred</span>);
                    }
                }
            }
            setStateSwitch("unknown");
        }

        const transferSFC = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await transferSFCtoken(userPublickey, walletName, Number(amount));
                    notifySuccess(<a href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer</a >);
                } catch (error: unknown) {
                    if (error instanceof Error) {
                        notifyError(<span>Transaction failed: {error.message}</span>);
                    } else {
                        notifyError(<span>Transaction failed: Unknown error occurred</span>);
                    }
                }
            }
            setStateSwitch("unknown");
        }

        switch (switchState) {
            case "asset":
                console.log("asset");
                transferAsset();
                break;
            case "SFC":
                transferSFC();
                console.log("sfc");
                break;
            case "LP":
                console.log("lp");
                break;
            default:
                setStateSwitch("unknown");
                break;
        }
    }, [switchMode, amount, walletName, userPublickey, switchState]);

    useEffect(() => {
        const numericValue = parseFloat(amount);
        if (!isNaN(numericValue)) {
            setConvertMoney(convertAmount(numericValue, switchMode));
        } else {
            setConvertMoney("");
        }
    }, [switchMode, amount]);

    const convertAmount = (amount: number, mode: ModeTransfer): string => {
        switch (mode) {
            case "asset":
                return formatConverter(amount);
            case "SFC":
                return formatConverter(amount * SFCprice);
            case "LP":
                return "";
            default:
                return "";
        }
    };

    return (
        <>
            {typeAction == "transfer" && (
                <div>
                    <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                        <input
                            value={amount === "0" ? "" : amount}
                            onChange={handleInputChange}
                            type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~ {convertMoney ? `${convertMoney} VND` : ""}</div>
                    </div>
                    <ButtonBuilder
                        onClick={handleClickTransfer}
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

export { InputCustom, InputTargetAddress, InputQtyMintBurn, InputQtyTransfer };