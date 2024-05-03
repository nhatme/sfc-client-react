import { FC } from "react"
import { CardStableCoin } from "../components/CardsCustom"
import { ButtonProps, TabProps } from "../interfaces/CustomProps"
import { CardFooter } from "@material-tailwind/react"
import { InputCustom } from "../components/Inputs"
import TransparentTabs from "../components/TabsCustom"

const StableCoin: FC = () => {
    const buttonsEl: ButtonProps[] = [
        {
            label: "meow2",
            onClick: () => console.log("heleo"),
        },
        {
            label: "meow2",
            onClick: () => console.log("heleo2"),
            className: "mt-3"
        },
    ]

    return (
        <div className="flex gap-3">
            <div className="w-full">
                <CardStableCoin
                    nameCard="Card1"
                    buttons={buttonsEl}
                    inputBox={<InputCustom placeHolder="Paste target address here" className="flex flex-col bg-gray-100 p-3 rounded-lg mt-3" type="text" />}
                />
                <CardStableCoin className="mt-3" nameCard="Card2" />
                <CardStableCoin nameCard="card 3" className="mt-3" />
            </div>
            <CardStableCoin className="w-full flex justify-between" nameCard="Information" cardFooter={<CardFooter><hr /></CardFooter>} />
        </div>
    )
}

const TabsHandle: FC = () => {
    const data: TabProps[] = [
        {
            label: "target",
            value: "label",
            desc: <StableCoin />,
        },
        {
            label: "my own",
            value: "value",
            desc: <StableCoin />,
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