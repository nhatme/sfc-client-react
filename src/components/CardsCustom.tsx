import {
    Card,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { FC } from "react";
import { CardsProps } from "../interfaces/CustomProps";

const CardStableCoin: FC<CardsProps> = ({ className, nameCard, buttons, inputBox, typograph, cardFooter }) => {
    return (
        <Card className={`${className}`}>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {nameCard}
                </Typography>
                {typograph}
                <div className="">
                    {buttons && buttons.map(({ className, onClick, label }, index) => (
                        <div>
                            <Button className={`${className}`} key={index} onClick={onClick}>{label}</Button>
                        </div>
                    ))}
                </div>
                {inputBox}
            </CardBody>
            {cardFooter}
        </Card>
    );
}

export { CardStableCoin }