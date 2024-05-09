import { FC, useState } from "react";
import {
    Button,
    Dialog,
    DialogHeader,
    DialogBody,
    DialogFooter,
    IconButton,
    Typography
} from "@material-tailwind/react";
import { XMarkIcon } from "@heroicons/react/24/outline";
import logoPhantom from '../images/phantomlogo.png';
import { WalletAdapter } from "../utils/WalletAdapter";

const Web3Dialog: FC = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    const [phantomState, connectPhantom] = WalletAdapter();

    return (
        <>
            <Button onClick={handleOpen}>{phantomState[1] === true ? "Conntected" : "Connect Wallet"}</Button>
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

                            <Button onClick={connectPhantom} variant="outlined" className="flex items-center justify-between gap-3 bg-white">
                                <Typography
                                    className="flex gap-6"
                                    variant="h6"
                                >
                                    <div className="capitalize">Phantom</div>
                                    <div className="text-purple-500">{phantomState[1] === true ? "Conntected" : ""}</div>
                                </Typography>
                                <img
                                    src={logoPhantom}
                                    alt="metamast"
                                    className="h-6 w-6"
                                />
                            </Button>

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