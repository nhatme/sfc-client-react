import defineRoutes from "../config/defineRoutes";
import { BuyAndSell } from "../pages/BuyAndSell";
import Home from "../pages/Home";
import Pool from "../pages/Pool";
import ParentBoard from "../pages/StableCoin";

const publicRoutes = [
    {
        path: defineRoutes.swap,
        component: BuyAndSell
    },
    {
        path: defineRoutes.stablesfc,
        component: ParentBoard
    },
    {
        path: defineRoutes.pool,
        component: Pool
    },
    {
        path: defineRoutes.home,
        component: Home
    }
]
export { publicRoutes };