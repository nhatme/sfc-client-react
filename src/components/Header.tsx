import { Button } from "@material-tailwind/react";
import { Link } from "react-router-dom";
import logo from "../images/logo.png";
import { ButtonHeader } from "./Button";
import { Web3Dialog } from "./Dialog";
import { DrawerRight } from "./Drawer";
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
                    <div className="h-10 justify-start items-start gap-8 inline-flex">
                        <div><Button variant="outlined">0 SFC</Button></div>
                        <div>
                            <Web3Dialog />
                        </div>
                        <div className="flex"><DrawerRight /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}