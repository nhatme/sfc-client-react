import { ButtonHeader } from "../components/Button"
import { Button } from "@material-tailwind/react";
import logo from "../images/logo.png"
import { Dropdown } from "../components/Dropdown";
import { Web3Dialog } from "../components/Dialog";
export const Header = () => {
    return (
        <div className="bg-[#F8F8F9]">
            <div className="flex justify-between mx-8 h-20">
                <div className="flex gap-[40px] items-center">
                    <div><img src={logo} alt="logo" /></div>
                    <ButtonHeader buttonText={"Swap"} />
                    <ButtonHeader buttonText={"Pool"} />
                    <ButtonHeader buttonText={"Vote"} />
                </div>
                <div className="flex items-center">
                    <div className="h-10 justify-start items-start gap-8 inline-flex">
                        <div><Button variant="outlined">0 SFC</Button></div>
                        <div><Web3Dialog /></div>
                        <div className="flex"> <Dropdown /> </div>
                    </div>
                </div>
            </div>
        </div>
    )
}