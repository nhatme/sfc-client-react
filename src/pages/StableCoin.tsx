import { FC } from "react"
import { CardStableCoin } from "../components/CardsCustom"
import { ButtonProps } from "../interfaces/CustomProps"
import { CardFooter, Typography } from "@material-tailwind/react"

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

const StableCoin: FC = () => {
    return (
        <div className="bg-gray-100 flex justify-center pt-5 h-full w-full">
            <div className="w-2/3">
                <div className="flex gap-3">
                    <div className="w-full">
                        <CardStableCoin nameCard="Card1" />
                        <CardStableCoin nameCard="Card2" className="mt-3" buttons={buttonsEl} />
                        <CardStableCoin nameCard={"Meow"} className="mt-3" typograph={
                            <Typography>
                                alo
                            </Typography>
                        } />
                    </div>
                    <CardStableCoin className="w-full flex justify-between" nameCard="Information" cardFooter={<CardFooter><hr /></CardFooter>} />
                </div>
            </div>
        </div>
    )
}

export { StableCoin }