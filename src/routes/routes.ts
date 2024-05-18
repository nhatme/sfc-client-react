import defineRoutes from "../config/defineRoutes";
import { Pool } from "../pages/Pool";
import TabsHandle from "../pages/StableCoin";
import { Swap } from "../pages/Trading";

const publicRoutes = [
    {
        path: defineRoutes.home,
        component: Swap
    },
    {
        path: defineRoutes.swap,
        component: Swap
    },
    {
        path: defineRoutes.stablesfc,
        component: TabsHandle
    },
    {
        path: defineRoutes.pool,
        component: Pool
    }
]
export { publicRoutes };