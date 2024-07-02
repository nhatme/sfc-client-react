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
import { Alert, AlertProps, Snackbar, SnackbarCloseReason } from "@mui/material";
import { mintAndBurnLPtoken } from "../utils/LiquidProvide/liquidprovider";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { typeliquidity } from "../utils/LiquidProvide/liquidprovider";
import SnackbarComponent from "./Notification";
import buyAndSellSOLviaSFC from "../utils/Trade/BuyAndSellSol";

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
    const [amount, setAmount] = useState(0);
    const [convertMoney, setConvertMoney] = useState<string>("");

    const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<ReactNode | null>(null);

    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const solType = state.buyAndSellSol.type;
    const buySolIsTarget = state.buyAndSellSol.isTarget;

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue == '') {
            setAmount(0);
            setConvertMoney("");
            return;
        }
        const regex = /[^0-9.]/g;
        let sanitizedValue = inputValue.replace(regex, '');
        const decimalCount = (sanitizedValue.match(/\./g) || []).length;
        if (decimalCount > 1) {
            sanitizedValue = sanitizedValue.replace(/\.+$/, '');
        }
        const numericValue = parseFloat(sanitizedValue);
        console.log(numericValue);

        setAmount(numericValue);
    };

    const handleBuyAndSellSolviaSfc = async () => {
        if (userPublickey && amount !== 0) {
            console.log("hello");
            try {
                const txHash = await buyAndSellSOLviaSFC(userPublickey, amount, walletName, solType);
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
    }

    return (
        <>
            {(solType === "buy" || solType === "sell") && (
                <div className="mt-2">
                    <div>
                        <div className="flex items-center justify-between">
                            <div className="flex items-center pb-2">
                                <img className="w-8 h-8" src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" alt="" />
                                <div className="ml-3 text-2xl font-semibold text-purple-500">SOL</div>
                            </div>
                            <div className="text-sm text-purple-500">Balance: 0</div>
                        </div>
                        <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                            <input
                                value={amount === 0 ? "" : amount}
                                onChange={handleInputChange}
                                type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                            <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                        </div>
                    </div>
                    <div className="mt-4">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center pb-2">
                                <img className="w-8 h-8 rounded-full" src="https://i.ibb.co/vxRnDKx/SFC-VND.jpg" alt="" />
                                <div className="ml-3 text-2xl font-semibold text-purple-500">SFC</div>
                            </div>
                            <div className="text-sm text-purple-500">Balance: 0</div>
                        </div>
                        <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                            <input
                                disabled
                                type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                            <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                        </div>
                    </div>
                    {userPublickey ? (
                        <ButtonBuilder
                            onClick={handleBuyAndSellSolviaSfc}
                            btnType="circle-square" sizeVariant="large" paddingSize="Small"
                            classNameCustom={`mt-4px text-center text-white ${(amount === 0) ? "bg-purple-100" : "bg-purple-500 cursor-pointer"}`}
                            cursor="not-allowed"
                            btnName="Enter an amount" border="gray-border"
                        />
                    ) : <div className="mt-4px"><Web3Dialog /></div>}
                </div>
            )}
            <SnackbarComponent open={open} severity={severity} message={snackbarMessage} onClose={handleClose} />
        </>
    )
}

const InputLiquidPool: FC<{ typeLiquid: typeliquidity }> = ({ typeLiquid }) => {
    const { state } = useWallet();
    const [stateData, setStateData] = useState({
        amountLP: 0,
        SFCprovide: 0,
        SOLprovide: 0,
        mySolBalance: 0,
        mySfcBalance: 0,
        poolSOL: 0,
        poolSFC: 0,
        LPtokenSupply: 0,
    });

    const [severity, setSeverity] = useState<'success' | 'error' | 'info'>('info');
    const [open, setOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState<ReactNode | null>(null);

    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;

    const solBalance = state.walletBalance.sol;
    const sfcBalance = state.walletBalance.sfc;

    // initial state balance of pool and user
    useEffect(() => {
        if (userPublickey && state.liquidPool) {
            const { poolSOL, poolSFC, LPtokenSupply, currentSOL, currentSFC } = state.liquidPool;
            setStateData(prevState => ({
                ...prevState,
                poolSOL,
                poolSFC,
                LPtokenSupply,
                mySolBalance: currentSOL,
                mySfcBalance: currentSFC,
            }));
        } else {
            setStateData(prevState => ({
                ...prevState,
                poolSOL: 0,
                poolSFC: 0,
                LPtokenSupply: 0,
                mySolBalance: 0,
                mySfcBalance: 0,
            }));
        }
    }, [userPublickey, state.liquidPool]);

    useEffect(() => {
        if (solBalance !== undefined && sfcBalance !== undefined) {
            setStateData(prevState => ({
                ...prevState,
                mySolBalance: solBalance,
                mySfcBalance: sfcBalance,
            }));
        }
    }, [solBalance, sfcBalance]);

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
        const inputValue = event.target.value;
        if (inputValue === '') {
            setStateData(prevState => ({ ...prevState, amountLP: 0 }));
            return;
        }
        const regex = /[^0-9.]/g;
        let sanitizedValue = inputValue.replace(regex, '');
        const decimalCount = (sanitizedValue.match(/\./g) || []).length;
        if (decimalCount > 1) {
            sanitizedValue = sanitizedValue.replace(/\.+$/, '');
        }
        const numericValue = parseFloat(sanitizedValue);
        setStateData(prevState => ({ ...prevState, amountLP: numericValue }));
    };

    useEffect(() => {
        const { amountLP, LPtokenSupply, poolSOL, poolSFC } = stateData;
        if (LPtokenSupply > 0) {
            const SOLprovide = (amountLP / LPtokenSupply) * poolSOL;
            const SFCprovide = SOLprovide * (poolSFC / poolSOL); // for 1 SOL ~ ... SFC
            setStateData(prevState => ({
                ...prevState,
                SOLprovide: SOLprovide / LAMPORTS_PER_SOL,
                SFCprovide: SFCprovide / LAMPORTS_PER_SOL,
            }));
        }
    }, [stateData.amountLP, stateData.LPtokenSupply, stateData.poolSFC, stateData.poolSOL]);

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

    const handleMintTokenLP = async () => {
        if (userPublickey) {
            if (stateData.amountLP !== 0) {
                try {
                    const txHash = await mintAndBurnLPtoken(userPublickey, stateData.amountLP, walletName, typeLiquid);
                    setSeverity('success');
                    setSnackbarMessage(
                        <div className="flex items-center gap-6px">
                            <p>Transaction successful!</p>
                            <a className="underline" href={`https://explorer.solana.com/tx/${txHash}?cluster=devnet`} target="_blank">Click to check on Explorer.</a>
                        </div>
                    );
                    setOpen(true);
                    setStateData(prevState => ({
                        ...prevState, amountLP: 0
                    }));
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
        }
    }

    return (
        <div className="flex w-full">
            <div className="w-2/3 mr-4">
                <div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center pb-2">
                            <img className="w-8 h-8" src="https://upload.wikimedia.org/wikipedia/en/b/b9/Solana_logo.png" alt="" />
                            <div className="ml-3 text-2xl font-semibold text-purple-500">SOL</div>
                        </div>
                        <div className="text-sm text-purple-500">Balance: {stateData.mySolBalance !== 0 ? stateData.mySolBalance.toFixed(4) : 0.0}</div>
                    </div>
                    <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                        <input
                            disabled value={isNaN(stateData.SOLprovide) ? "" : stateData.SOLprovide * LAMPORTS_PER_SOL}
                            type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                    </div>
                </div>
                <div className="mt-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center pb-2">
                            <img className="w-8 h-8 rounded-full" src="https://i.ibb.co/vxRnDKx/SFC-VND.jpg" alt="" />
                            <div className="ml-3 text-2xl font-semibold text-purple-500">SFC</div>
                        </div>
                        <div className="text-sm text-purple-500">Balance: {stateData.mySfcBalance !== 0 ? stateData.mySfcBalance.toFixed(2) : 0.0}</div>
                    </div>
                    <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                        <input
                            disabled value={isNaN(stateData.SFCprovide) ? "" : stateData.SFCprovide * LAMPORTS_PER_SOL}
                            type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                    </div>
                </div>
                {userPublickey ? (
                    <ButtonBuilder
                        onClick={handleMintTokenLP}
                        btnType="circle-square" sizeVariant="large" paddingSize="Small"
                        classNameCustom={`mt-4px text-center text-white ${stateData.amountLP === 0 ? "bg-purple-100 cursor-not-allowed" : "bg-purple-500 cursor-pointer"}`}
                        cursor="not-allowed"
                        btnName="Enter an amount" border="gray-border" />
                ) : <div className="mt-4px"><Web3Dialog /></div>}
            </div>
            {/* ////////////////////////////////////////////////////////////////////////////// */}
            <div className="w-1/3 flex flex-col justify-end">
                {/* <p className="text-purple-500 mb-2">Enter your LP token you want to mint first, based on that we can calculate the SOL/SFC liquidity you have to provide </p> */}
                <div>
                    <img className="w-8 h-8 mb-2 rounded-full" src="https://i.ibb.co/wMRXC4M/LP-Token-Logo.webp" alt="" />
                    <div className="flex flex-col p-6px gap-4px border-1 border-gray-border rounded-custom-ssm bg-purple-50">
                        <input
                            value={stateData.amountLP}
                            onChange={handleInputChange}
                            type="text" className="text-right text-fs-24 text-purple-500 font-medium outline-none bg-purple-50 w-full" placeholder="0.0" />
                        <div className="text-fs-12 font-medium text-gray-200 text-right">~</div>
                    </div>
                </div>
            </div>
            <SnackbarComponent open={open} severity={severity} message={snackbarMessage} onClose={handleClose} />
        </div>
    )
}

export { InputCustom, InputTargetAddress, InputQtyMintBurn, InputQtyTransfer, InputQtyBuyAndSell, InputLiquidPool };
