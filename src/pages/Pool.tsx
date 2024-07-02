import { FC, useEffect, useState } from "react";
import { useWallet } from "../hooks/useWallet";
import { InputLiquidPool } from "../components/Inputs";
import { ButtonBuilder } from "../components/Button";
import { fetchLPtokenSupply, fetchSFCfromVault, fetchSOLfromVault } from "../utils/LiquidProvide/mod";
import { fetchBalanceSOL, getStableSFC } from "../utils/Utilities";
import { LAMPORTS_PER_SOL } from "@solana/web3.js";
import { typeliquidity } from "../utils/LiquidProvide/liquidprovider";

const Pool: FC = () => {
    const { state, dispatch } = useWallet();
    const [typeLiquid, setTypeLiquid] = useState<typeliquidity>("add");

    const userPublickey = state.myPublicKey.publicKey;

    useEffect(() => {
        (async () => {
            if (userPublickey) {
                try {
                    const [poolSOL, poolSFC, LPtokenSupply] = await Promise.all([
                        fetchSOLfromVault(),
                        fetchSFCfromVault(),
                        fetchLPtokenSupply()
                    ]);

                    let SFCupdate: number = 0;
                    let SOLupdate: number = 0;

                    const SFC = await getStableSFC(userPublickey);
                    if (typeof SFC === 'number' && !isNaN(SFC)) {
                        SFCupdate = SFC;
                    }

                    const SOL = await fetchBalanceSOL(userPublickey);
                    if (typeof SOL === 'number' && !isNaN(SOL)) {
                        SOLupdate = SOL / LAMPORTS_PER_SOL;
                    }

                    dispatch({
                        type: "UPDATE_LIQUID_POOL",
                        payload: {
                            poolSOL: poolSOL / LAMPORTS_PER_SOL,
                            poolSFC: poolSFC / LAMPORTS_PER_SOL,
                            LPtokenSupply: LPtokenSupply / LAMPORTS_PER_SOL,
                            currentSOL: SOLupdate,
                            currentSFC: SFCupdate
                        }
                    });
                } catch (error) {
                    console.error("Error fetching data:", error);
                }
            }
        })();
    }, [userPublickey]);

    return (
        <div className="py-16">
            <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50 mb-3`}>
                <div className="flex gap-1">
                    <ButtonBuilder onClick={() => setTypeLiquid("add")} btnName={"Add Liquidity"} btnType="circle" sizeVariant="small" paddingSize="Medium" border="gray-border" cursor="pointer" classNameCustom={typeLiquid === "add" ? "text-white bg-purple-500" : "text-purple-500 bg-white"} />
                    <ButtonBuilder onClick={() => setTypeLiquid("widthdraw")} btnName={"Widthdraw Liquidity"} btnType="circle" sizeVariant="small" paddingSize="Medium" border="gray-border" cursor="pointer" classNameCustom={typeLiquid === "widthdraw" ? "text-white bg-purple-500" : "text-purple-500 bg-white"} />
                </div>
                {typeLiquid === "add" ? (<>
                    <div className="text-fs-md font-normal text-purple-500 mt-12px">Add Liquidity SFC/SOL</div>
                    <div>
                        <div className="flex flex-col gap-4px mt-12px">
                            <InputLiquidPool typeLiquid={typeLiquid} />
                        </div>
                    </div>
                </>) : (<>
                    <div className="text-fs-md font-normal text-purple-500 mt-12px">Add Liquidity SFC/SOL</div>
                    <div>
                        <div className="flex flex-col gap-4px mt-12px">
                            <InputLiquidPool typeLiquid={typeLiquid} />
                        </div>
                    </div>
                </>)}
            </div>
            {/* //////////////////////////////////////////////// */}
            <div className={`mx-56 border-1 rounded-3xl p-16px shadow-md bg-gray-50`}>
                Liquidity
            </div>
        </div>
    )
}

export default Pool;