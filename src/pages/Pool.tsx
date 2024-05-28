import { FC } from "react"
import { useWallet } from "../hooks/useWallet"
import { InputLiquidPool } from "../components/Inputs";

const Pool: FC = () => {
    const { dispatch } = useWallet();

    return (
        <div className="py-16">
            <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
                <div className="">
                    <div className="flex flex-col gap-4px mt-12px">
                        <div className="text-fs-md font-medium text-purple-500">You're providing a liquid pool for SOL/SFC trading pair</div>
                        <div className="text-fs-sm font-medium text-purple-500">Deposit amount</div>
                        <InputLiquidPool />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Pool;