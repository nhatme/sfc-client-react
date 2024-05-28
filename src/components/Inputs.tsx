import { ChangeEvent, FC, ReactNode, forwardRef, useEffect, useState } from "react";
import { InputCustomProps } from "../interfaces/CustomProps";
import { ButtonBuilder } from "./Button";
import { ClipboardDocumentListIcon } from "@heroicons/react/16/solid";
import { useWallet } from "../hooks/useWallet";
import { lockTargetAddress } from "../utils/LockTargetAddress";
import { ActionHandleButton, ModeTransfer } from "../constants/constant";
import { burnTokenSFCandTarget, mintTokenFromAsset, mintTokenSFCTarget } from "../utils/MintAndBurn";
import { Web3Dialog } from "./Dialog";
import { transferAssets, transferSFCtoken } from "../utils/Transfer";
import { SFCprice } from "../config/programConfig";
import { formatConverter } from "../utils/Utilities";
import { Alert, AlertProps, Snackbar } from "@mui/material";

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
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<ReactNode | string>("");
    const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [targetAddress, setTargetAddress] = useState<string>("");
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const userPublickey = state.myPublicKey.publicKey;
    const walletType = state.myPublicKey.walletType;

    const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
        function SnackbarAlert(props, ref) {
            return <Alert elevation={6} ref={ref} {...props} />
        }
    )

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

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
        (async () => {
            if (buttonClicked && targetAddress && userPublickey && walletType) {
                try {
                    const txHash = await lockTargetAddress(userPublickey, targetAddress, walletType);
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Lock target successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
                }
            }
        })();
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
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}>
                <SnackbarAlert onClose={handleClose} severity={severity}>
                    {snackbarMessage}
                </SnackbarAlert>
            </Snackbar >
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
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<ReactNode | string>("");
    const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [action, setAction] = useState<ActionHandleButton | null>(null);

    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const typeAction = state.mintAndBurn.type;
    const isTarget = state.mintAndBurn.isTarget;

    // useEffect(() => {
    //     console.log(isTarget);
    // }, [isTarget]);

    // useEffect(() => {
    //     console.log(typeAction);
    // }, [typeAction]);

    const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
        function SnackbarAlert(props, ref) {
            return <Alert elevation={6} ref={ref} {...props} />
        }
    )

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

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
        const mintToken = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await mintTokenFromAsset(userPublickey, walletName, Number(amount));
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
                }
            }
            setAction(null);
        }

        const burnToken = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await burnTokenSFCandTarget(userPublickey, walletName, Number(amount), isTarget);
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
                }
            }
            setAction(null);
        }

        const mintTokenTarget = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await mintTokenSFCTarget(userPublickey, walletName, Number(amount));
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
                }
            }
            setAction(null);
        }

        const burnTokenTarget = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await burnTokenSFCandTarget(userPublickey, walletName, Number(amount), isTarget, typeAction);
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
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
            {(typeAction === "mint" || typeAction === "burn") && (
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
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}>
                <SnackbarAlert onClose={handleClose} severity={severity}>
                    {snackbarMessage}
                </SnackbarAlert>
            </Snackbar >
        </>
    )
}

const InputQtyTransfer: FC = () => {
    const { state } = useWallet();
    const [amount, setAmount] = useState<string>("0");
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<ReactNode | string>("");
    const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [switchState, setStateSwitch] = useState<ModeTransfer>("unknown");
    const [convertMoney, setConvertMoney] = useState<string>("");
    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const typeAction = state.transfers.type;
    const switchMode = state.transfers.mode;

    const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
        function SnackbarAlert(props, ref) {
            return <Alert elevation={6} ref={ref} {...props} />
        }
    )

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

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
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
                }
            }
            setStateSwitch("unknown");
        }

        const transferSFC = async () => {
            if (userPublickey && walletName) {
                try {
                    const txHash = await transferSFCtoken(userPublickey, walletName, Number(amount));
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                } catch (error: unknown) {
                    setSeverity('error');
                    if (error instanceof Error) {
                        setSnackbarMessage(`Transaction failed: ${error.message}`);
                    } else {
                        setSnackbarMessage('Transaction failed: Unknown error occurred');
                    }
                    setOpen(true);
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
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}>
                <SnackbarAlert onClose={handleClose} severity={severity}>
                    {snackbarMessage}
                </SnackbarAlert>
            </Snackbar >
        </>
    )
}

const InputQtyBuyAndSell: FC = () => {
    const { state } = useWallet();
    const [amount, setAmount] = useState<string>("0");
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<ReactNode | null>(null);
    const [severity, setSeverity] = useState<'success' | 'error' | 'info' | 'warning'>("info");
    const [convertMoney, setConvertMoney] = useState<string>("");

    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const solType = state.buyAndSellSol.type;
    const buySolIsTarget = state.buyAndSellSol.isTarget;

    useEffect(() => {
        console.log(solType);
    }, [solType]);

    useEffect(() => {
        console.log(buySolIsTarget);
    }, [buySolIsTarget]);

    const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
        function SnackbarAlert(props, ref) {
            return <Alert elevation={6} ref={ref} {...props} />
        }
    )

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

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
    };



    return (
        <>
            {(solType === "buySOL" || solType === "sellSOL") && (
                <div>
                    <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                        <input
                            value={amount === "0" ? "" : amount}
                            onChange={handleInputChange}
                            type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~ {convertMoney ? `${convertMoney} VND` : ""}</div>
                    </div>
                    <ButtonBuilder
                        btnType="circle-square" sizeVariant="large" paddingSize="Small"
                        classNameCustom={`mt-4px text-center text-white ${(amount === "0" || amount == "") ? "bg-purple-100" : "bg-purple-500 cursor-pointer"}`}
                        cursor="not-allowed"
                        btnName="Enter an amount" border="gray-border"
                    />
                </div>
            )}
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}>
                <SnackbarAlert onClose={handleClose} severity={severity}>
                    {snackbarMessage}
                </SnackbarAlert>
            </Snackbar >
        </>
    )
}

const InputLiquidPool: FC = () => {
    const [amount, setAmount] = useState<string>("0");

    return (
        <div>
            <div>
                <img className="w-8 h-8 mb-2" src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" alt="" />
                <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                    <input
                        // value={amount === "0" ? "" : amount}
                        // onChange={handleInputChange}
                        type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                    <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                </div>
            </div>
            <div className="mt-4">
                <img className="w-8 h-8 mb-2" src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" alt="" />
                <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                    <input
                        // value={amount === "0" ? "" : amount}
                        // onChange={handleInputChange}
                        type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                    <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                </div>
            </div>
            <ButtonBuilder
                btnType="circle-square" sizeVariant="large" paddingSize="Small"
                classNameCustom={`mt-4px text-center text-white ${(amount === "0" || amount == "") ? "bg-purple-100" : "bg-purple-500 cursor-pointer"}`}
                cursor="not-allowed"
                btnName="Enter an amount" border="gray-border"
            />
        </div>
    )
}

export { InputCustom, InputTargetAddress, InputQtyMintBurn, InputQtyTransfer, InputQtyBuyAndSell, InputLiquidPool };