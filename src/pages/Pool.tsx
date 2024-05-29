import { FC } from "react";
import { useWallet } from "../hooks/useWallet";
import { InputLiquidPool } from "../components/Inputs";
import { fetchSFCfromVault } from "../utils/LiquidProvide/mod";
import { mintLPtoken } from "../utils/LiquidProvide/liquidprovider";

const Pool: FC = () => {
    const { state, dispatch } = useWallet();

    const publickey = state.myPublicKey.publicKey;
    fetchSFCfromVault();
    if (publickey)
        mintLPtoken(publickey, 10);
    return (
        <div className="py-16">
            <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50 mb-3`}>
                <div className="">
                    <div className="flex flex-col gap-4px mt-12px">
                        <div className="text-fs-md font-medium text-purple-500">You're providing a liquid pool for SOL/SFC trading pair</div>
                        <InputLiquidPool />
                    </div>
                </div>
            </div>
            {/* //////////// */}
            <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
                Liquidity
            </div>
        </div>
    )
}

export default Pool;