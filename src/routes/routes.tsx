import defineRoutes from "../config/defineRoutes";
import { Swap } from "../pages/Trading";

const publicRoutes = [
    {
        path: defineRoutes.swap,
        component: Swap
    },
    {
        path: defineRoutes.home,
        component: Swap
    }
]
// const privateRoutes = [
//     {
//         path: defineRoutes.swap,
//         component: Swap
//     }
// ]
export { publicRoutes };