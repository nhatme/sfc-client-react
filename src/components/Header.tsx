import { FC, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ButtonBuilder, ButtonHeader } from "./Button";
import { Web3Dialog } from "./Dialog";
import { getStableSFC } from "../utils/Utilities";
import { useWallet } from "../hooks/useWallet";
import { Spinner } from "@material-tailwind/react";

export const Header: FC = () => {
    const { state } = useWallet();
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);
    const userPublickey = state.myPublicKey.publicKey;
    const getSfcBalance = state.walletBalance.sfc;

    useEffect(() => {
        setBalance(getSfcBalance)
    }, [getSfcBalance]);

    useEffect(() => {
        if (userPublickey) {
            setLoading(true);
            getStableSFC(userPublickey)
                .then(balance => {
                    if (typeof balance == "number") {
                        setBalance(balance);
                    }
                })
                .catch(err => { setBalance(0); })
                .finally(() => { setLoading(false); });
        }
    }, [userPublickey]);

    return (
        <div className="">
            <div className="flex justify-between mx-8 h-20">
                <div className="flex gap-[40px] items-center">
                    <Link to={"/"} >
                        <ButtonHeader buttonName={"Home"} url="/" />
                    </Link>
                    <ButtonHeader buttonName={"Stable SFC"} url="/stable_sfc" />
                </div>
                <div className="flex items-center">
                    <div className="flex items-center h-10 justify-start gap-8">
                        {userPublickey && (
                            <div>
                                {loading ? (
                                    <Spinner />
                                ) : (
                                    balance === 0 ? <ButtonBuilder paddingSize="Medium" sizeVariant="medium" btnName="Deposit now"
                                        classNameCustom="bg-purple-500 text-white" btnType="circle-square" cursor="pointer" /> :
                                        <ButtonBuilder paddingSize="Large" sizeVariant="medium" btnName={`${balance.toFixed(1)} SFC`} btnType="circle" classNameCustom="text-purple-500" />
                                )}
                            </div>
                        )}
                        <div>
                            <Web3Dialog />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}