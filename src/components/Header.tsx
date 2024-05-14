import { Link } from "react-router-dom";
import logo from "../assets/logo.png";
import { ButtonBuilder, ButtonHeader } from "./Button";
import { Web3Dialog } from "./Dialog";
import { FC } from "react";

export const Header: FC = () => {
    return (
        <div className="">
            <div className="flex justify-between mx-8 h-20">
                <div className="flex gap-[40px] items-center">
                    <Link to={"/"} >
                        <div><img src={logo} alt="logo" /></div>
                    </Link>
                    <ButtonHeader buttonName={"Swap"} url="/ex_" />
                    <ButtonHeader buttonName={"Pool"} url="/pool" />
                    <ButtonHeader buttonName={"Stable SFC"} url="/stable_sfc" />
                </div>
                <div className="flex items-center">
                    <div className="flex items-center h-10 justify-start gap-8">
                        <div><ButtonBuilder paddingSize="Large" sizeVariant="medium" btnName="0 SFC" btnType="circle" /></div>
                        <div>
                            {/* <PublickeyProvider> */}
                            <Web3Dialog />
                            {/* </PublickeyProvider> */}
                        </div>
                        {/* <div className="flex"><DrawerRight /></div> */}
                    </div>
                </div>
            </div>
        </div>
    );
}