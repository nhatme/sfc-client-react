import { useState } from "react";
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

const Web3Dialog = () => {
    const [open, setOpen] = useState(false);
    const handleOpen = () => setOpen((cur) => !cur);
    return (
        <>
            <Button onClick={handleOpen}>Connect Wallet</Button>
            <Dialog size="xs" open={open} handler={handleOpen}
                animate={{
                    mount: { scale: 1, y: 0 },
                    unmount: { scale: 0.9, y: -50 },
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
                            <Button variant="outlined" className="flex items-center justify-between gap-3 bg-white">
                                <Typography
                                    className="uppercase"
                                    color="blue-gray"
                                    variant="h6"
                                >
                                    MetaMask
                                </Typography>
                                <img
                                    src="https://docs.material-tailwind.com/icons/metamask.svg"
                                    alt="metamast"
                                    className="h-6 w-6"
                                />
                            </Button>
                            <Button variant="outlined" className="flex items-center justify-between gap-3 bg-white">
                                <Typography
                                    className="uppercase"
                                    color="blue-gray"
                                    variant="h6"
                                >
                                    MetaMask
                                </Typography>
                                <img
                                    src="https://docs.material-tailwind.com/icons/metamask.svg"
                                    alt="metamast"
                                    className="h-6 w-6"
                                />
                            </Button>
                            <Button variant="outlined" className="flex items-center justify-between gap-3 bg-white">
                                <Typography
                                    className="uppercase"
                                    color="blue-gray"
                                    variant="h6"
                                >
                                    Coinbase
                                </Typography>
                                <img
                                    src="https://docs.material-tailwind.com/icons/coinbase.svg"
                                    alt="metamast"
                                    className="h-6 w-6 rounded-md"
                                />
                            </Button>
                        </ul>
                    </div>
                </DialogBody>
                <DialogFooter className="justify-center">
                    <p className="text-black">Powered by Solana</p>
                </DialogFooter>
            </Dialog>
        </>
    );
}

export { Web3Dialog }