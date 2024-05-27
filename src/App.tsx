import { Routes, Route } from "react-router-dom";
import { publicRoutes } from './routes/routes';
import { AppLayout } from './layouts/AppLayout';
import { useWallet } from "./hooks/useWallet";
import { useEffect } from "react";
import { connection } from "./config/programConfig";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { getAssetUser, getStableSFC } from "./utils/Utilities";

function App() {
  const { state, dispatch } = useWallet();
  const publickey = state.myPublicKey.publicKey;
  const walletName = state.myPublicKey.walletType;

  useEffect(() => {
    (async () => {
      if (publickey) {
        const ACCOUNT_TO_WATCH = new PublicKey(publickey);
        const subscriptionId = connection.onAccountChange(
          ACCOUNT_TO_WATCH,
          async (updatedAccountInfo) => {
            const SOL = updatedAccountInfo.lamports / LAMPORTS_PER_SOL;
            const SFC = await getStableSFC(publickey);
            const Asset = await getAssetUser(publickey, walletName);
            dispatch({ type: "UPDATE_BALANCE", payload: { sol: SOL, sfc: Number(SFC), asset: Number(Asset) } });
          },
          "confirmed"
        );
        // console.log('Starting web socket, subscription ID: ', subscriptionId);
      }
    })();
  }, [connection, publickey]);

  return (
    <>
      <Routes>
        <Route element={<AppLayout />}>
          {publicRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Route>
        {/* <Route element={<AppLayout />}>
          {privateRoutes.map((route, index) => {
            const Page = route.component;
            return <Route key={index} path={route.path} element={<Page />} />;
          })}
        </Route> */}
      </Routes>
    </>
  );
}

export default App;
