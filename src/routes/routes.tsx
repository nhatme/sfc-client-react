import defineRoutes from "../config/defineRoutes";
import Home from "../pages/Home";
import Swap from "../pages/Swap";

const publicRoutes = [
    {
        path: defineRoutes.home,
        component: Home
    },
]
const privateRoutes = [
    {
        path: defineRoutes.swap,
        component: Swap
    }
]
export { publicRoutes, privateRoutes };