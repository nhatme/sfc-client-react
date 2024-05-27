import { FC, useState } from "react"
import { ButtonBuilder } from "../components/Button"
import { CurrencyDollarIcon } from "@heroicons/react/16/solid"
import { InputQtyBuyAndSell } from "../components/Inputs"
import { useWallet } from "../hooks/useWallet"
import { Switch } from "@material-tailwind/react"

const BuyAndSell: FC = () => {
    const { state, dispatch } = useWallet();
    const [isTarget, setTarget] = useState(false);

    const handleBuyBtn = () => {
        dispatch({ type: "UPDATE_BUY_SELL_SOL", payload: { type: "buySOL", amount: 0, isTarget: false } });
    }

    const handleSellBtn = () => {
        dispatch({ type: "UPDATE_BUY_SELL_SOL", payload: { type: "sellSOL", amount: 0, isTarget: false } });
    }

    const handleIsTarget = () => {
        setTarget(true);
    }
    
    return (
        <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
            <div className="">
                <div className="flex flex-col gap-4px mt-12px">
                    <div className="text-fs-md italic font-medium text-purple-500">Buy & Sell SOL via SFC token</div>
                    <div className="flex items-center gap-6px">
                        <div className="flex items-center gap-8px">
                            <div className="flex gap-6px">
                                <ButtonBuilder
                                    btnName="Buy" onClick={handleBuyBtn}
                                    border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium"
                                    classNameCustom={"text-purple-500 bg-white"} />
                                <ButtonBuilder
                                    btnName="Sell" onClick={handleSellBtn}
                                    border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium"
                                    classNameCustom={"text-purple-500 bg-white"} />
                            </div>
                            <CurrencyDollarIcon className="h-5 w-5 text-gray-500" />
                        </div>
                        <div className="ml-28px text-xl italic text-purple-500">
                            <Switch onClick={handleIsTarget} label="target?" color="purple" ripple={true} crossOrigin={undefined} />
                        </div>
                    </div>
                    <div>
                        <InputQtyBuyAndSell />
                    </div>
                </div>
                <div className="border-b-1 border-gray-border my-32px"></div>
                <div className=""></div>
            </div>
        </div>
    )
}

export { BuyAndSell }