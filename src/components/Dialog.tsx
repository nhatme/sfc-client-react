import { FC, useEffect, useState } from "react";
import {
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Typography
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import logoPhantom from '../assets/phantomlogo.png';
import logoOkx from '../assets/OKX_logo.png';
import solflareLogo from '../assets/solflare_logo.png'
import {
    connectPhantom,
    connectOkx,
    connectSolflare,
    useWalletStates,
    providerPhantomWallet,
    providerOkx, providerSolflare,
} from "../utils/WalletProvider";
import { ButtonBuilder } from "./Button";

const Web3Dialog: FC = () => {
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen((cur) => !cur);

    const {
        phantomStatePublickey,
        okxStatePublickey,
        solflareStatePublickey,
    } = useWalletStates();

    providerPhantomWallet.on("connect", () => {
        console.log(phantomStatePublickey);
        console.log("phantom: " + providerPhantomWallet.isConnected);
    })
    providerPhantomWallet.on("disconnect", () => {
        console.log("Phantom is disconnected");
        console.log("Phantom: " + providerPhantomWallet.isConnected);
    })

    providerOkx.on("connect", () => {
        console.log(okxStatePublickey);
        console.log("OKX: " + providerOkx.isConnected);
    })

    providerOkx.on("disconnect", () => {
        console.log("OKX is disconnected");
        console.log("OKX: " + providerOkx.isConnected);
    })

    // providerSolflare.provider.on("connect", () => {
    //     console.log(providerSolflare.provider.publicKey?.toString());
    //     console.log("Solflare connected: " + providerSolflare.provider.isConnected);
    // })

    // providerSolflare.provider.on("disconnect", () => {
    //     console.log(providerSolflare.provider.publicKey?.toString());
    //     console.log("Solflare connected: " + providerSolflare.provider.isConnected);
    // })

    // console.log("phantom: " + phantomStatePublickey);
    // console.log("Okx: " + okxStatePublickey);
    // console.log("Solflare: " + solflareStatePublickey);

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

                            <ButtonBuilder btnName="Phantom" paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                cursor="pointer"
                                border="black-border"
                                onClick={connectPhantom}
                                classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                    <img
                                        src={logoPhantom}
                                        alt="phantom"
                                        className="h-6 w-6"
                                    />
                                }
                            />

                            <ButtonBuilder btnName="OKX" paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                cursor="pointer"
                                border="black-border"
                                onClick={connectOkx}
                                classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                    <img
                                        src={logoOkx}
                                        alt="phantom"
                                        className="h-6 w-6"
                                    />
                                }
                            />

                            <ButtonBuilder btnName="Solflare" paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                cursor="pointer"
                                border="black-border"
                                onClick={connectSolflare}
                                classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                    <img
                                        src={solflareLogo}
                                        alt="phantom"
                                        className="h-6 w-6"
                                    />
                                }
                            />

                        </ul>
                    </div>
                </DialogBody>
                <DialogFooter className="justify-center">
                    <p className="text-black-500 text-fs-md">Powered by Solana</p>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export { Web3Dialog }