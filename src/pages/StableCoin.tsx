import { FC } from "react"
import { CardStableCoin } from "../components/CardsCustom"
import { ButtonProps, TabProps } from "../interfaces/CustomProps"
import { CardFooter, Typography } from "@material-tailwind/react"
import { ControlTabs } from "../components/ControlTabs"
import { Board } from "../components/Board"

// const StableCoin: FC = () => {
//     const buttonsEl: ButtonProps[] = [
//         {
//             label: "meow2",
//             onClick: () => console.log("helleo"),
//         },
//     ]

//     return (
//         <div className="flex gap-3">
//             <div className="w-full h-96">
//                 <CardStableCoin
//                     variant="h5"
//                     className="h-full"
//                     nameCard="settings"
//                     buttons={buttonsEl}
//                 />
//             </div>
//             <CardStableCoin variant="h5" className="w-full flex justify-between" nameCard="Information" cardFooter={<CardFooter><hr /></CardFooter>} />
//         </div>
//     )
// }

const TabsHandle: FC = () => {
    return (
        <div className="flex items-start pt-10 h-full">
            <div className="flex flex-col gap-10px">
                <div>
                    <ControlTabs />
                </div>
                <div>
                    <Board />
                </div>
            </div>
        </div>
    )
}

export { TabsHandle }