import {
    Card,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { FC } from "react";
import { CardsProps } from "../interfaces/CardProps";

const CardStableCoin: FC<CardsProps> = ({ className, nameCard, buttons, typograph, cardFooter }) => {
    return (
        <Card className={`${className}`}>
            <CardBody>
                <Typography variant="h5" color="blue-gray" className="mb-2">
                    {nameCard}
                </Typography>
                {typograph}
                <div className="">
                    {buttons && buttons.map((button, index) => (
                        <div>
                            <Button className={`${button.className}`} key={index} onClick={button.onClick}>{button.label}</Button>
                        </div>
                    ))}
                </div>
            </CardBody>
            {cardFooter}
        </Card>
    );
}

export { CardStableCoin }