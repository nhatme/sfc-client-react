import { FC } from "react"
import { ButtonBuilder } from "../components/Button"
import { CircleStackIcon } from "@heroicons/react/16/solid"
import { InputQtyBuyAndSell } from "../components/Inputs"

const BuyAndSell: FC = () => {
    return (
        <div className={`mx-16px border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
            <div className="">
                <div className="flex flex-col gap-4px mt-12px">
                    <div className="text-fs-md italic font-medium text-purple-500">Buy & Sell SOL via SFC token</div>
                    <div className="flex items-center justify-between gap-6px">
                        <div className="flex items-center gap-8px">
                            <div className="flex gap-6px">
                                <ButtonBuilder
                                    border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Buy"
                                    classNameCustom={"text-purple-500 bg-white"} />
                                <ButtonBuilder
                                    border="gray-border" btnType="circle" cursor="pointer" paddingSize="Medium" sizeVariant="medium" btnName="Sell"
                                    classNameCustom={"text-purple-500 bg-white"} />
                            </div>
                            <CircleStackIcon className="h-5 w-5 text-gray-500" />
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