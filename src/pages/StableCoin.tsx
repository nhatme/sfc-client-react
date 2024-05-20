import { FC, useEffect, useState } from "react";
import { ControlTabs } from "../components/ControlTabs";
import { Board } from "../components/Board";
import { CircleStackIcon } from "@heroicons/react/24/outline";
import { BoltIcon, CheckIcon, ClipboardDocumentListIcon, QuestionMarkCircleIcon } from "@heroicons/react/16/solid";
import { ButtonBuilder } from "../components/Button";
import { InputQuantityMintBurn } from "../components/Inputs";
import { StatusStProps } from "../interfaces/CustomProps";
import { useWallet } from "../hooks/useWallet";
import { prettierPublickey } from "../utils/ManageWalletAccount";
import { closeAsset, openAsset } from "../utils/AssetsCash";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { fetchPDA } from "../utils/coral";
import { PublicKey } from "@solana/web3.js";
import { ActionHandleButton } from "../constants/constant";
import { Web3Dialog } from "../components/Dialog";
import { Switch } from "@material-tailwind/react";

const SettingBoard: FC = () => {
    const { state, dispatch } = useWallet();
    const phantomAdapter = new PhantomWalletAdapter();
    const [action, setAction] = useState<ActionHandleButton | null>(null);
    const [checkedTarget, setCheckedTarget] = useState(false);
    const [actionMintBurn, setActionMintBurn] = useState<ActionHandleButton | null>(null);

    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const type = state.mintAndBurn.type;

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

    useEffect(() => {
        const connectAndOpenAsset = async () => {
            if (userPublickey && walletName) {
                if (!phantomAdapter.connected) {
                    await phantomAdapter.connect();
                }
                const [pda, num] = fetchPDA(new PublicKey(userPublickey), "client");
                if (pda instanceof PublicKey) {
                    openAsset(userPublickey, walletName, pda);
                } else {
                    console.log("PDA is not a publickey");
                }
            }
        };

        console.log(checkedTarget);

        const connectAndCloseAsset = async () => {
            if (userPublickey && walletName) {
                if (!phantomAdapter.connected) {
                    await phantomAdapter.connect();
                }
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
                setAction(null);
                break;
        }
        setAction(null);
    }, [action, checkedTarget, actionMintBurn, userPublickey, walletName]);

    return (
        <div className={`mx-16px ${userPublickey ? "" : ""} border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
            {userPublickey ? (
                <div className="">
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
                    <div className="flex flex-col gap-4px mt-12px">
                        <div className="text-fs-14 italic font-bold text-purple-500">Mint & Burn SFC token</div>

                        <div className="flex items-center justify-between gap-6px">
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
                            <InputQuantityMintBurn />
                        </div>
                    </div>
                </div>
            ) : <div>
                <Web3Dialog />
                <h3>Connect wallet before use this feature ~~</h3>
            </div>}
            <div className="border-b-1 border-gray-border my-32px"></div>
            <div className="">
                <div className="flex mb-4px">
                    <ButtonBuilder border="gray-border" btnType="circle" paddingSize="Medium" sizeVariant="medium" btnName="Transfer" cursor="pointer"
                        classNameCustom="text-purple-500 flex gap-4px" icon={<BoltIcon className="h-5 w-5 text-purple-500" />} />
                </div>
                <div>
                    <h5 style={{ color: "red" }}>* Maintain</h5>
                    {/* <InputQuantityTransfer /> */}
                </div>
            </div>
        </div>
    )
}

const StatusOfSt: FC<StatusStProps> = ({ name, value, unit, icon }) => {
    return (
        <div className="flex justify-between text-purple-500 font-bold text-fs-sm">
            <div className="flex items-center gap-2px">{name}{icon}</div>
            <div>{value + " " + unit}</div>
        </div>
    )
}

const StatusBoard: FC = () => {
    const { state } = useWallet();
    const [userPrettyPublickey, setUserPublickey] = useState<string | undefined>(undefined);
    const userPublickey = state.myPublicKey.publicKey;
    useEffect(() => {
        if (userPublickey !== undefined) {
            setUserPublickey(prettierPublickey(userPublickey));
        }
    }, [userPublickey]);
    return (
        <div>
            <div className="mx-16px flex flex-col gap-8px">
                <StatusOfSt name="Tokenomics" value="100" unit="SFC" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="SOL Balance" value="100" unit="SOL" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
                <StatusOfSt name="Asset Balance" value="100" unit="VND" icon={<QuestionMarkCircleIcon className="h-4 w-4 text-purple-200" />} />
            </div>
            <div className="border-b-1 border-gray-border my-16px"></div>
            <div className="mx-16px flex justify-between">
                <div className="flex flex-col gap-6px">
                    <ButtonBuilder border="gray-border" btnName="Open Asset" btnType="circle" paddingSize="Small" sizeVariant="small"
                        classNameCustom="flex items-center gap-4px text-purple-500"
                        icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                    />
                    <ButtonBuilder border="gray-border" btnName="open Asset" btnType="circle" paddingSize="Small" sizeVariant="small"
                        classNameCustom="flex items-center gap-4px text-purple-500"
                        icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                    />
                    <ButtonBuilder border="gray-border" btnName="Open SFC" btnType="circle" paddingSize="Small" sizeVariant="small"
                        classNameCustom="flex items-center gap-4px text-purple-500"
                        icon={<CheckIcon className="h-4 w-4 text-success-500" />}
                    />
                </div>
                <div className="border-r-1 border-gray-border mx-16px"></div>
                <div className="flex flex-col gap-4px">
                    <StatusOfSt name="Account name: " value="Meow Meow Meow" unit="" />
                    <ButtonBuilder border="gray-border" btnName={`${userPrettyPublickey === undefined ? "" : userPrettyPublickey}`} btnType="circle" paddingSize="Medium" sizeVariant="small"
                        classNameCustom="flex items-center gap-16px text-purple-500" icon={<ClipboardDocumentListIcon className="h-5 w-5 text-purple-500 cursor-pointer" />}
                    />
                    <div className="flex gap-4px">
                        <img
                            className="h-48px w-48px rounded-full object-cover object-center shadow-xl"
                            src="https://www.economywatch.com/wp-content/uploads/2021/06/solana-1.jpg"
                            alt="nature image"
                        />
                        <img
                            className="h-48px w-48px rounded-full object-cover object-center shadow-xl"
                            src="https://www.economywatch.com/wp-content/uploads/2021/06/solana-1.jpg"
                            alt="nature image"
                        />
                    </div>
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

const TabsHandle: FC = () => {
    return (
        <div className="flex items-start pt-10 h-full">
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

export default TabsHandle;