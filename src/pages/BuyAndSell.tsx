import { FC, useState } from "react"
import { ButtonBuilder } from "../components/Button"
import { CurrencyDollarIcon } from "@heroicons/react/16/solid"
import { InputQtyBuyAndSell } from "../components/Inputs"
import { useWallet } from "../hooks/useWallet"
import { Switch } from "@material-tailwind/react"
import { Trading } from "../store/types"



const BuyAndSell: FC = () => {
    const { dispatch } = useWallet();
    const [isTarget, setTarget] = useState(false);
    const [actionBuySellSol, setActionBuySellSol] = useState<Trading>("buy");

    const handleSwitchBtn = () => {
        setTarget(prevIsTarget => !prevIsTarget);
        if (actionBuySellSol)
            dispatch({ type: "UPDATE_BUY_SELL_SOL", payload: { amount: 0, type: actionBuySellSol, isTarget: !isTarget } });
    }

    const handleBuyBtn = () => {
        dispatch({ type: "UPDATE_BUY_SELL_SOL", payload: { type: "buy", amount: 0, isTarget: isTarget } });
        setActionBuySellSol("buy");
    }

    const handleSellBtn = () => {
        dispatch({ type: "UPDATE_BUY_SELL_SOL", payload: { type: "sell", amount: 0, isTarget: isTarget } });
        setActionBuySellSol("sell");
    }

    return (
        <div className="py-16">
            <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
                <div className="">
                    <div className="flex flex-col gap-4px mt-12px">
                        <div className="text-fs-md font-medium text-purple-500">Buy & Sell SOL via SFC token</div>
                        <div className="flex items-center gap-6px">
                            <div className="flex items-center gap-8px">
                                <div className="flex gap-6px">
                                    <ButtonBuilder
                                        btnName="Buy" onClick={handleBuyBtn}
                                        border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium"
                                        classNameCustom={actionBuySellSol === "buy" ? " text-white bg-purple-500" : "text-purple-500 bg-white"} />
                                    <ButtonBuilder
                                        btnName="Sell" onClick={handleSellBtn}
                                        border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium"
                                        classNameCustom={actionBuySellSol === "sell" ? " text-white bg-purple-500" : "text-purple-500 bg-white"} />
                                </div>
                                <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                            </div>
                            <div className="ml-28px text-xl italic text-purple-500">
                                <Switch onClick={handleSwitchBtn} label="target?" color="purple" ripple={true} crossOrigin={undefined} />
                            </div>
                        </div>
                        <div>
                            <InputQtyBuyAndSell />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export { BuyAndSell }