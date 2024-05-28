import { FC, useEffect, useState } from "react";
import { ControlTabs } from "../components/ControlTabs";
import { Board } from "../components/Board";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { BoltIcon, CheckIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { ButtonBuilder } from "../components/Button";
import { InputQtyMintBurn, InputQtyTransfer } from "../components/Inputs";
import { StatusStProps } from "../interfaces/CustomProps";
import { useWallet } from "../hooks/useWallet";
import { prettierPublickey } from "../utils/ManageWalletAccount";
import { closeAsset, openAsset } from "../utils/AssetsCash";
import { fetchPDA } from "../utils/coral";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { ActionHandleButton, ModeTransfer } from "../constants/constant";
import { Web3Dialog } from "../components/Dialog";
import { Switch } from "@material-tailwind/react";
import { fetchBalanceSOL, formatConverter, getAssetUser, getStableSFC } from "../utils/Utilities";

const SettingBoard: FC = () => {
    const { state, dispatch } = useWallet();
    const [action, setAction] = useState<ActionHandleButton>("unknown");
    const [switchMode, setSwitchMode] = useState<ModeTransfer>("unknown");
    const [checkedTarget, setCheckedTarget] = useState(false);
    const [actionMintBurn, setActionMintBurn] = useState<ActionHandleButton | null>(null);
    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const type = state.mintAndBurn.type;
    const typeTransfer = state.transfers.type;
    const openAssetAcc = state.assetAccount;

    const handleSwitch = () => {
        setCheckedTarget(prevCheckedTarget => !prevCheckedTarget);
        if (actionMintBurn)
            dispatch({ type: "UPDATE_AMOUNT_MINT_BURN", payload: { amount: 0, type: actionMintBurn, isTarget: !checkedTarget } });
    };

    const handleOpenAsset = () => {
        setAction("open");
    }

    const handleCloseAsset = () => {
        setAction("close");
    }

    const handleMint = () => {
        dispatch({ type: "UPDATE_AMOUNT_MINT_BURN", payload: { amount: 0, type: "mint", isTarget: checkedTarget } });
        setActionMintBurn("mint");
    }

    const handleBurn = () => {
        dispatch({ type: "UPDATE_AMOUNT_MINT_BURN", payload: { amount: 0, type: "burn", isTarget: checkedTarget } });
        setActionMintBurn("burn");
    }

    const handleTransfer = () => {
        dispatch({ type: "UPDATE_TRANSFERS", payload: { amount: 0, type: "transfer", mode: "unknown" } });
    }

    const handleSwitchModeAsset = () => {
        setSwitchMode("asset");
        dispatch({ type: "UPDATE_TRANSFERS", payload: { amount: 0, type: "transfer", mode: "asset" } });
    }
    const handleSwitchModeSFC = () => {
        setSwitchMode("SFC");
        dispatch({ type: "UPDATE_TRANSFERS", payload: { amount: 0, type: "transfer", mode: "SFC" } });

    }
    const handleSwitchModeLP = () => {
        setSwitchMode("LP");
        dispatch({ type: "UPDATE_TRANSFERS", payload: { amount: 0, type: "transfer", mode: "LP" } });
    }

    useEffect(() => {
        console.log(openAssetAcc);
    }, [openAssetAcc])

    useEffect(() => {
        const connectAndOpenAsset = async () => {
            if (userPublickey && walletName) {
                const [pda, num] = fetchPDA(new PublicKey(userPublickey), "client");
                if (pda instanceof PublicKey) {
                    openAsset(userPublickey, walletName, pda);
                } else {
                    console.log("PDA is not a publickey");
                }
            }
        }
        const connectAndCloseAsset = async () => {
            if (userPublickey && walletName) {
                const [pda, num] = fetchPDA(new PublicKey(userPublickey), "client");
                if (pda instanceof PublicKey) {
                    closeAsset(userPublickey, walletName, pda);
                } else {
                    console.log("PDA is not a publickey");
                }
            }
        }

        switch (action) {
            case "open":
                connectAndOpenAsset();
                break;
            case "close":
                connectAndCloseAsset();
                break;
            default:
                setAction("unknown");
                break;
        }
        setAction("unknown");
    }, [action, checkedTarget, actionMintBurn, switchMode, userPublickey, walletName]);

    return (
        <div className={`mx-16px ${userPublickey ? "" : ""} border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
            {userPublickey ? (
                <div className="">
                    {!openAssetAcc && (
                        <div className="flex flex-col gap-4px">
                            <div className="text-fs-14 italic font-bold text-purple-500">Open & Close Asset</div>
                            <div className="flex gap-6px">
                                <ButtonBuilder
                                    onClick={handleOpenAsset}
                                    btnName="Open" border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" classNameCustom="text-purple-500 bg-white" />
                                <ButtonBuilder
                                    onClick={handleCloseAsset} btnName="Close" border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" classNameCustom="text-purple-500 bg-white" />
                            </div>
                        </div>
                    )}
                    <div className="flex flex-col gap-4px mt-12px">
                        <div className="text-fs-14 italic font-bold text-purple-500">Mint & Burn SFC token</div>
                        <div className="flex items-center gap-6px">
                            <div className="flex items-center gap-8px">
                                <div className="flex gap-6px">
                                    <ButtonBuilder
                                        onClick={handleMint}
                                        border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Mint"
                                        classNameCustom={(type !== "unknown" && type === "mint") ? " text-white bg-purple-500" : "text-purple-500 bg-white"} />
                                    <ButtonBuilder
                                        onClick={handleBurn}
                                        border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Burn"
                                        classNameCustom={(type !== "unknown" && type === "burn") ? " text-white bg-purple-500" : "text-purple-500 bg-white"} />
                                </div>
                                <CircleStackIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            {type !== "unknown" ? (
                                <div className="ml-28px text-xl italic text-purple-500">
                                    <Switch onClick={handleSwitch} label="target?" color="purple" ripple={true} crossOrigin={undefined} />
                                </div>
                            ) : ""}
                        </div>
                        <div>
                            <InputQtyMintBurn />
                        </div>
                    </div>
                    <div className="border-b-1 border-gray-border my-32px"></div>
                    <div className="">
                        <div className="border-1 mb-12px rounded-lg p-8px bg-gradient-117-to-l shadow-md">
                            <div className="flex mb-4px">
                                {typeTransfer == "transfer" ? (
                                    <ButtonBuilder
                                        onClick={handleTransfer}
                                        border="gray-border" btnType="circle" paddingSize="Medium" sizeVariant="medium" btnName="Transfer" cursor="pointer"
                                        classNameCustom="text-white flex gap-4px bg-purple-500" icon={<BoltIcon className="h-5 w-5 text-white" />} />
                                ) : (
                                    <ButtonBuilder
                                        onClick={handleTransfer}
                                        border="gray-border" btnType="circle" paddingSize="Medium" sizeVariant="medium" btnName="Transfer" cursor="pointer"
                                        classNameCustom="text-purple-500 flex gap-4px" icon={<BoltIcon className="h-5 w-5 text-purple-500" />} />
                                )}
                            </div>
                            {typeTransfer == "transfer" && (
                                <div className="flex items-center gap-8px">
                                    <div className="text-xl italic rounded-lg bg-purple-200 py-4px px-12px font-bold">
                                        <Switch checked={switchMode === "asset"} onClick={handleSwitchModeAsset} label="Asset" color="purple" ripple={true} crossOrigin={undefined} style={{ color: "white" }} />
                                    </div>
                                    <div className="text-xl italic rounded-lg bg-purple-200 py-4px px-12px font-bold">
                                        <Switch checked={switchMode === "SFC"} onClick={handleSwitchModeSFC} label="SFC" color="purple" ripple={true} crossOrigin={undefined} />
                                    </div>
                                    <div className="text-xl italic rounded-lg bg-purple-200 py-4px px-12px font-bold ">
                                        <Switch checked={switchMode === "LP"} onClick={handleSwitchModeLP} label="LP" color="purple" ripple={true} crossOrigin={undefined} />
                                    </div>
                                </div>
                            )}
                        </div>
                        <div>
                            <InputQtyTransfer />
                        </div>
                    </div>
                </div>
            ) : <div>
                <Web3Dialog />
                <h3 className="text-center mt-12px">Connect wallet before use this feature ~~</h3>
            </div>}
        </div>
    )
}

const StatusOfSt: FC<StatusStProps> = ({ name, value, unit, icon, classNameCustom }) => {
    return (
        <div className={`flex justify-between ${classNameCustom} text-purple-500`}>
            <div className="flex items-center gap-2px text-fs-sm">{name}{icon}</div>
            <div className="text-fs-md">{value + " " + unit}</div>
        </div>
    )
}

const StatusBoard: FC = () => {
    const { state, dispatch } = useWallet();
    const [userPrettyPublickey, setUserPublickey] = useState<string | undefined>(undefined);

    const [SFCbalance, setSFCBalance] = useState(0);
    const [walletAsset, setWalletAsset] = useState(0);
    const [balanceSOL, setBalanceSOL] = useState(0);

    // const [bunchOfBalance, setBunchOfBalance] = useState({ sol: 0, sfc: 0, asset: 0 });
    const [assetPubkey, setAssetPubkey] = useState<string | null>(null);
    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const openTokenAcc = state.tokenAccount;

    const getSolBalance = state.walletBalance.sol;
    const getSfcBalance = state.walletBalance.sfc;
    const getAssetBalance = state.walletBalance.asset;

    useEffect(() => {
        setSFCBalance(getSfcBalance);
        setWalletAsset(getAssetBalance);
        setBalanceSOL(getSolBalance);
    }, [getSolBalance, getSfcBalance, getAssetBalance]);

    useEffect(() => {
        if (userPublickey)
            getStableSFC(userPublickey)
                .then(balance => {
                    if (typeof balance == "number") {
                        setSFCBalance(balance);
                    }
                }).catch(err => { setSFCBalance(0); });
    }, [SFCbalance, userPublickey]);

    useEffect(() => {
        if (userPublickey) {
            // init balance
            (async () => {
                const SOL = await fetchBalanceSOL(userPublickey);
                if (SOL)
                    setBalanceSOL(SOL);
            })();

            (async () => {
                const userWalletAsset = await getAssetUser(userPublickey, walletName);
                setWalletAsset(Number(userWalletAsset));
                setAssetPubkey(userWalletAsset);
                dispatch({ type: "UPDATE_ASSET_ACCOUNT", payload: { openAssetAcc: true } });
            })();
            setUserPublickey(prettierPublickey(userPublickey));
        }
    }, [userPublickey, walletAsset, balanceSOL]);

    return (
        <div>
            <div className="mx-16px flex flex-col gap-8px">
                <StatusOfSt name="Tokenomics" value={`${formatConverter(SFCbalance.toFixed(1))}`} unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="SOL Balance" value={`${formatConverter((balanceSOL / LAMPORTS_PER_SOL))}`} unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Asset Balance" value={`${formatConverter(walletAsset)}`} unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
            <div className="border-b-1 border-gray-border my-16px"></div>
            <div className="mx-16px flex justify-between">
                <div className="flex flex-col gap-6px">
                    {openTokenAcc && (
                        <ButtonBuilder border="gray-border" btnName="Open SFC" btnType="circle" paddingSize="Small" sizeVariant="small"
                            classNameCustom="flex items-center gap-4px text-purple-500"
                            icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                        />
                    )}
                    {assetPubkey && (
                        <ButtonBuilder border="gray-border" btnName="Open Asset" btnType="circle" paddingSize="Small" sizeVariant="small"
                            classNameCustom="flex items-center gap-4px text-purple-500"
                            icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                        />
                    )}
                </div>
                <div className="">
                    {userPublickey && (
                        <div className="border-1 p-12px rounded-lg shadow-md bg-gradient-117-to-r">
                            <StatusOfSt name="Account name: " value="Meow Meow Meow" unit="" classNameCustom="text-purple-500 font-medium" />
                            <div className="flex items-center gap-8px text-purple-500 font-medium shadow-md">
                                {userPrettyPublickey === undefined ? "" : userPrettyPublickey}
                                <div>
                                    <ClipboardDocumentListIcon className="w-5 h-5 cursor-pointer" />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

const CirculatingBoard: FC = () => {
    return (
        <div className="flex mx-16px">
            <div className="flex flex-col w-1/2">
                <StatusOfSt name="SFC TOKEN" value="100" unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Market Cap" value="100" unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Circulating" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Total Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Max Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
            <div className="border-r-1 border-gray-border mx-16px"></div>
            <div className="flex flex-col w-1/2">
                <StatusOfSt name="SOL TOKEN" value="100" unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Market Cap" value="100" unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Circulating" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Total Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Max Supply" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
        </div>
    )
}

const ParentBoard: FC = () => {
    return (
        <div className="flex items-start py-16">
            <div className="flex flex-col gap-10px">
                <ControlTabs />
                <div className="flex gap-8px">
                    <Board nameBoard="Settings" gradientType="bg-gradient-117-to-l" content={<SettingBoard />} width="w-[572px]" />
                    <div className="flex flex-col gap-8px">
                        <Board nameBoard="Status" content={<StatusBoard />} width="w-[572px]" />
                        <Board nameBoard="Circulating Supply?" width="" content={<CirculatingBoard />} />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default ParentBoard;