import { FC, useEffect, useState } from "react";
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
import { ButtonBuilder } from "./Button";
import { DrawerRight } from "./Drawer";
import { initWalletLocalStorage, removeItemLocalStorage } from "../utils/ManageLocalStorage";
import { useWallet } from "../hooks/useWallet";
import { PhantomWalletAdapter } from "@solana/wallet-adapter-phantom";
import { SolflareWalletAdapter } from "@solana/wallet-adapter-solflare";

const Web3Dialog: FC = () => {
    const [phantomAdapter, setPhantomAdapter] = useState<PhantomWalletAdapter | null>(null);
    const [solflareAdapter, setSolflareAdapter] = useState<SolflareWalletAdapter | null>(null);
    const [open, setOpen] = useState<boolean>(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const [loading, setLoading] = useState<boolean>(false);
    const { state, dispatch } = useWallet();

    useEffect(() => {
        const phantomAdapter = new PhantomWalletAdapter();
        setPhantomAdapter(phantomAdapter);
        const solflareAdapter = new SolflareWalletAdapter();
        setSolflareAdapter(solflareAdapter);

        phantomAdapter.on("connect", () => {
            dispatch({ type: "UPDATE_PUBLICKEY_ACTION", payload: { publicKey: phantomAdapter.publicKey?.toString(), walletType: "Phantom" } });
            initWalletLocalStorage("Phantom", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
        });

        phantomAdapter.on("readyStateChange", (event) => {
            dispatch({ type: "UPDATE_PUBLICKEY_ACTION", payload: { publicKey: event.toString(), walletType: "Phantom" } });
        })

        solflareAdapter.on("connect", () => {
            dispatch({ type: "UPDATE_PUBLICKEY_ACTION", payload: { publicKey: solflareAdapter.publicKey?.toString(), walletType: "Solflare" } });
            initWalletLocalStorage("Solflare", "WALLET_EXTENSION_WATCHING", "open-wallet-previous");
        });

        return () => {
            phantomAdapter.disconnect();
            solflareAdapter.disconnect();
        }

    }, []);

    const connect = async (adapter: any) => {
        try {
            return await adapter.connect();
        } catch (error) {
            return error;
        }
    }

    if (!state.myPublicKey.publicKey) {
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
                                        {phantomAdapter && (
                                            <ButtonBuilder btnName={`${phantomAdapter.name} Detected`} paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                                cursor="pointer"
                                                border="black-border"
                                                onClick={() => {
                                                    setLoading(true);
                                                    connect(phantomAdapter).then(() => {
                                                        setLoading(false);
                                                    }).catch(err => {
                                                        console.log(err);
                                                    });
                                                }}
                                                classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                                    <img
                                                        src={phantomAdapter.icon}
                                                        alt="phantom"
                                                        className="h-6 w-6"
                                                    />
                                                }
                                            />
                                        )}
                                        {solflareAdapter && (
                                            <ButtonBuilder btnName={`${solflareAdapter.name} Detected`} paddingSize="Medium" sizeVariant="small" btnType="circle-square"
                                                cursor="pointer"
                                                border="black-border"
                                                onClick={() => {
                                                    setLoading(true);
                                                    connect(solflareAdapter).then(() => {
                                                        setLoading(false);
                                                    }).catch(err => {
                                                        console.log("Solflare", err);
                                                    });
                                                }}
                                                classNameCustom="flex items-center justify-between gap-3 bg-white text-purple-500" icon={
                                                    <img
                                                        src={solflareAdapter.icon}
                                                        alt="solflare"
                                                        className="h-6 w-6"
                                                    />
                                                }
                                            />
                                        )}
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
            <DrawerRight/>
        );
    }
}

export { Web3Dialog };