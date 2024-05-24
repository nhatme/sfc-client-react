import defineRoutes from "../config/defineRoutes";
import { BuyAndSell } from "../pages/BuyAndSell";
import TabsHandle from "../pages/StableCoin";

const publicRoutes = [
    {
        path: defineRoutes.home,
        component: BuyAndSell
    },
    {
        path: defineRoutes.stablesfc,
        component: TabsHandle
    },
]
export { publicRoutes };