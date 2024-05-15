import { FC, Fragment, useState } from "react";
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
import { useBalance } from "../utils/Utilities";
import { SOLANA_UNIT, SOLANA_PRICE } from "../constants/_solana_var";
import { formatConverter } from "../utils/Tools";

const DrawerRight: FC = () => {
    const { state, dispatch } = useWallet();
    const [openRight, setOpenRight] = useState(false);
    const openDrawerRight = () => setOpenRight(true);
    const closeDrawerRight = () => setOpenRight(false);
    const walletPrettier = state.myPublicKey.publicKey ? prettierPublickey(state.myPublicKey.publicKey) : null;

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

    const balance = useBalance();
    const balanceToUsd = (balance * SOLANA_PRICE).toFixed(2);

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
                                {balance + " " + SOLANA_UNIT}
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
                <Typography color="gray" className="mb-8 pr-4 font-normal">
                    <div>
                        <div className="text-fs-lg">{formatConverter(balanceToUsd)}</div>
                        <div>~{balance.toFixed(2)} {SOLANA_UNIT}</div>
                    </div>
                </Typography>
                <hr className="mb-8" />
                <div>
                    {/* <TabsDefault data={data} /> */}
                </div>
            </Drawer>
        </Fragment>
    );
}

export { DrawerRight }