import { FC } from "react"
import { CardStableCoin } from "../components/CardsCustom"
import { ButtonProps, TabProps } from "../interfaces/CustomProps"
import { CardFooter, Typography } from "@material-tailwind/react"
import TransparentTabs from "../components/TabsCustom"
import ControlledSelect from "../components/selectCustom"

const StableCoin: FC = () => {
    const buttonsEl: ButtonProps[] = [
        {
            label: "meow2",
            onClick: () => console.log("heleo"),
        },
    ]

    return (
        <div className="flex gap-3">
            <div className="w-full h-96">
                <CardStableCoin
                    variant="h5"
                    className="h-full"
                    nameCard="settings"
                    buttons={buttonsEl}
                />
            </div>
            <CardStableCoin variant="h5" className="w-full flex justify-between" nameCard="Information" cardFooter={<CardFooter><hr /></CardFooter>} />
        </div>
    )
}

const TabsHandle: FC = () => {
    const data: TabProps[] = [
        {
            label: "target",
            value: "target",
            desc: <StableCoin />,
            target: "target"
        },
        {
            label: "my own",
            value: "my own",
            desc: <StableCoin />,
            target: "self"
        }
    ];

    return (
        <div className="bg-gray-100 flex justify-center pt-5 h-full w-full">
            <div className="w-3/4">
                <TransparentTabs data={data} />
            </div>
        </div>
    )
}

export { TabsHandle }