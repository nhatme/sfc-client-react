import {
    Card,
    CardBody,
    Typography,
    Button,
} from "@material-tailwind/react";
import { FC } from "react";
import { CardsProps } from "../interfaces/CustomProps";

const CardStableCoin: FC<CardsProps> = ({ className, nameCard, buttons, inputBox, typograph, cardFooter, variant, selectOptions }) => {
    return (
        <Card className={`${className}`}>
            <CardBody>
                <Typography variant={variant} color="blue-gray" className="mb-2">
                    {nameCard}
                </Typography>
                {typograph}
                <div className="">
                    {buttons && buttons.map(({ className, onClick, label }, index) => (
                        <div key={index}>
                            <Button className={`${className}`} key={index} onClick={onClick}>{label}</Button>
                        </div>
                    ))}
                </div>
                {inputBox}
                {selectOptions}
            </CardBody>
            {cardFooter}
        </Card>
    );
}

export { CardStableCoin }