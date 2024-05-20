import { FC, Fragment, useEffect, useState } from "react";
import {
    Drawer,
    Typography,
} from "@material-tailwind/react";
import { ClipboardDocumentListIcon } from "@heroicons/react/24/outline";
import { ButtonBuilder } from "./Button";
import { disConnect, providerPhantomWallet, providerSolflareWallet } from "../utils/WalletProvider";
import { copyClipboard, prettierPublickey } from "../utils/ManageWalletAccount";
import { removeItemLocalStorage } from "../utils/ManageLocalStorage";
import { ArrowRightStartOnRectangleIcon, LinkIcon } from "@heroicons/react/16/solid";
import { useWallet } from "../hooks/useWallet";
import { fetchBalanceSFC, formatConverter, getListTokenFromWallet, getTokenMetadata } from "../utils/Utilities";
import { SOLANA_UNIT, SOLANA_PRICE } from "../constants/_solana_var";
import { depositAsset, withdrawAsset } from "../utils/DepositAndWithdraw";
import { AdminAuthor } from "../config/programConfig";
import { ActionHandleAsset } from "../constants/constant";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";

const DrawerRight: FC = () => {
    const { state, dispatch } = useWallet();
    const [openRight, setOpenRight] = useState(false);
    const openDrawerRight = () => setOpenRight(true);
    const closeDrawerRight = () => setOpenRight(false);
    const [balanceSOLlamport, setBalanceSOLlamport] = useState(0);
    const [action, setAction] = useState<ActionHandleAsset | null>(null);

    const userPublickey = state.myPublicKey.publicKey;
    const walletName = state.myPublicKey.walletType;
    const walletPrettier = userPublickey ? prettierPublickey(userPublickey) : null;

    const handleDisconnect = async () => {
        if (state.myPublicKey.walletType === "Phantom") {
            await disConnect(providerPhantomWallet);
            dispatch({ type: "UPDATE_PUBLICKEY_ACTION", payload: { publicKey: "", walletType: "Unknown" } });
            removeItemLocalStorage();
        } else if (state.myPublicKey.walletType === "Solflare") {
            await disConnect(providerSolflareWallet);
            dispatch({ type: "UPDATE_PUBLICKEY_ACTION", payload: { publicKey: "", walletType: "Unknown" } });
            removeItemLocalStorage();
        }
    }

    const handleButtonDeposit = () => {
        setAction("deposit");
    }

    const handleButtonWithdraw = () => {
        setAction("withdraw");
    }

    useEffect(() => {
        const connectAndDeposit = async () => {
            if (action && userPublickey && walletName) {
                await depositAsset(userPublickey, walletName, 10000);
            }
        }

        const connectAndWithdraw = async () => {
            if (action && userPublickey && walletName) {
                await withdrawAsset(userPublickey, walletName, 20000);
            }
        }

        switch (action) {
            case "deposit":
                connectAndDeposit();
                break;
            case "withdraw":
                connectAndWithdraw();
                break;
            default:
                setAction(null);
                break;
        }

        if (userPublickey) {
            (async () => {
                try {
                    const fetchSOLbalance = await fetchBalanceSFC(userPublickey);
                    setBalanceSOLlamport(fetchSOLbalance !== undefined ? fetchSOLbalance : 0); // Handle undefined
                    getListTokenFromWallet(userPublickey);
                    getTokenMetadata(userPublickey);
                } catch (error) {
                    console.error('Error fetching balance:', error);
                    setBalanceSOLlamport(0); // Optionally set balance to null or handle the error accordingly
                }
            })();
        }
        setAction(null);
    }, [action, userPublickey, walletName]);

    const balanceSOL = balanceSOLlamport / LAMPORTS_PER_SOL;

    return (
        <Fragment>
            <div className="flex flex-wrap gap-4">
                <ButtonBuilder onClick={openDrawerRight} btnName={walletPrettier}
                    paddingSize="Large" sizeVariant="small" btnType="circle"
                    cursor="pointer" classNameCustom="text-purple-500" />
            </div>
            <Drawer
                placement="right"
                open={openRight}
                onClose={closeDrawerRight}
                className="p-4"
                size={450}
            >
                <div className="mb-6">
                    <div className="flex justify-between items-center">
                        <div className="flex items-center">
                            <img src="https://s3.coinmarketcap.com/static-gravity/image/5cc0b99a8dd84fbfa4e150d84b5531f2.png" alt="avatar"
                                className="w-12 h-12 rounded-full mr-8px"
                            />
                            <div>
                                {balanceSOL + " " + SOLANA_UNIT}
                                <div>{walletPrettier}</div>
                            </div>
                        </div>

                        <div className="flex items-center gap-8px">
                            <div onClick={() => { copyClipboard(state.myPublicKey.publicKey) }} className="p-2 border-gray-border border-1 rounded-full bg-purple-50 cursor-pointer">
                                <ClipboardDocumentListIcon className="h-5 w-5 text-purple-500" />
                            </div>
                            <div onClick={() => {
                                window.open(`https://explorer.solana.com/address/${state.myPublicKey.publicKey ? state.myPublicKey.publicKey : null}?cluster=devnet`, "_blank");
                            }} className="p-2 border-gray-border border-1 rounded-full bg-purple-50 cursor-pointer">
                                <LinkIcon className="h-5 w-5 text-purple-500" />
                            </div>
                            <div className="p-2 border-gray-border border-1 rounded-full bg-purple-50 cursor-pointer"
                                onClick={handleDisconnect}
                            >
                                <ArrowRightStartOnRectangleIcon className="h-5 w-5 text-purple-500" />
                            </div>
                        </div>
                    </div>
                </div>
                <Typography color="gray" className="pr-4 font-normal">
                    <div>
                        <div className="text-fs-lg">{formatConverter(balanceSOL * SOLANA_PRICE)}</div>
                        <div>~{balanceSOL.toFixed(2)} {SOLANA_UNIT}</div>
                    </div>
                </Typography>
                {userPublickey === AdminAuthor && (
                    <div>
                        <h5 style={{ color: "red" }} >For asset *</h5>
                        <div className="flex gap-4px">
                            <ButtonBuilder
                                onClick={handleButtonDeposit}
                                btnName="Deposit"
                                btnType="circle-square"
                                paddingSize="Small"
                                sizeVariant="small" cursor="pointer"
                                classNameCustom="text-white bg-purple-500 "
                            />
                            <ButtonBuilder
                                onClick={handleButtonWithdraw}
                                btnName="Withdraw"
                                btnType="circle-square"
                                paddingSize="Small"
                                sizeVariant="small"
                                border="black-border" cursor="pointer"
                                classNameCustom="text-black bg-white"
                            />
                        </div>
                    </div>
                )}

                <hr className="mb-8 mt-8" />
                <div>
                    {/* <TabsDefault data={data} /> THIS IS FOR Tab data including list tokens and history txhash */}
                </div>
            </Drawer>
        </Fragment>
    );
}

export { DrawerRight }