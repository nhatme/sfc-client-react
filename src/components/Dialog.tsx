import { FC, useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Typography,
    Spinner,
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import logoPhantom from '../assets/phantomlogo.png';
import solflareLogo from '../assets/solflare_logo.png'
import {
    connectWallet,
    providerPhantomWallet,
    providerSolflareWallet,
    detectSolflare,
    detectPhantom,
    PublicKeyContext
} from "../utils/WalletProvider";
import { ButtonBuilder } from "./Button";
import { DrawerRight } from "./Drawer";
import { initWalletLocalStorage } from "../utils/ManageLocalStorage";
import { useWallet } from "../hooks/useWallet";
import { actions } from "../store";

const Web3Dialog: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useWallet();
    // console.log("nhat dialog", state);

    if (!state.publicKey) {
        return (
            <>
                <ButtonBuilder onClick={handleOpen} btnName="Connect Wallet" paddingSize="Large" sizeVariant="medium" btnType="circle" cursor="pointer" border="gray-border" />
                <Dialog size="xs" open={open} handler={handleOpen}
                    animate={{
                        mount: { scale: 1, y: 0 },
                        unmount: { scale: 0.9, y: 0 },
                    }}
                    className="bg-[#f8f8f9b3]">
                    <DialogHeader className="justify-between">
                        <div>
                            <Typography variant="h5" color="blue-gray" className="font-bold">
                                Connect a Wallet
                            </Typography>
                        </div>
                        <IconButton
                            color="blue-gray"
                            size="sm"
                            variant="text"
                            onClick={handleOpen}
                        >
                            <XMarkIcon className="h-6 w-6 text-black" />
                        </IconButton>
                    </DialogHeader>
                    <DialogBody className="scroll_hidable overflow-y-scroll !px-5 max-h-96">
                        <div className="mb-6">
                            <ul className="mt-3 flex flex-col gap-1">

                                {loading ? <div className="flex justify-center">
                                    <div className="flex flex-col justify-center items-center">
                                        <Spinner className="h-16 w-16 text-gray-900/50" />
                                        <div>Connecting...</div>
                                    </div>
                                </div> :
                                    <>
                                        {detectPhantom ? <ButtonBuilder btnName="Phantom Detected" paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                            cursor="pointer"
                                            border="black-border"
                                            onClick={() => {
                                                setLoading(true);
                                                connectWallet(providerPhantomWallet)
                                                    .then(pubkey => {
                                                        dispatch({ type: "UPDATE_PUBLICKEY", payload: { publicKey: pubkey.publicKey.toString(), type: "Phantom" } });
                                                        initWalletLocalStorage("Phantom", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
                                                        setLoading(false);
                                                    })
                                                    .catch(err => {
                                                        setLoading(false);
                                                        console.log(err);
                                                    });
                                                providerPhantomWallet.on("accountChanged", (pubkey: string) => {
                                                    dispatch({ type: "UPDATE_PUBLICKEY", payload: { publicKey: pubkey.toString(), type: "Phantom" } });
                                                    console.log(pubkey.toString());
                                                })
                                            }}
                                            classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                                <img
                                                    src={logoPhantom}
                                                    alt="phantom"
                                                    className="h-6 w-6"
                                                />
                                            }
                                        /> : ""}
                                        {detectSolflare ? <ButtonBuilder btnName="Solflare Detected" paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                            cursor="pointer"
                                            border="black-border"
                                            onClick={() => {
                                                setLoading(true);
                                                connectWallet(providerSolflareWallet)
                                                    .then(ok => {
                                                        // we ok callback a boolean value when wallet is connected
                                                        // console.log("à thế à", ok);
                                                        initWalletLocalStorage("Solflare", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
                                                        setLoading(false);
                                                    })
                                                    .catch(err => {
                                                        setLoading(false);
                                                        console.log(err);
                                                    });
                                                providerSolflareWallet.on("connect", (pubkey: string) => {
                                                    dispatch({ type: "UPDATE_PUBLICKEY", payload: { publicKey: pubkey.toString(), type: "Solflare" } });
                                                })
                                            }}
                                            classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                                <img
                                                    src={solflareLogo}
                                                    alt="phantom"
                                                    className="h-6 w-6"
                                                />
                                            }
                                        /> : ""}
                                    </>}
                            </ul>
                        </div>
                    </DialogBody>
                    <DialogFooter className="justify-center">
                        <p className="text-black-500 text-fs-md">Powered by Solana</p>
                    </DialogFooter>
                </Dialog>
            </>
        );
    } else {
        return (
            <DrawerRight
                
            />
        );
    }
}

export { Web3Dialog };