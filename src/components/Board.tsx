import { FC } from "react"
import { BoardProps } from "../interfaces/CustomProps";

const Board: FC<BoardProps> = ({ gradientType, nameBoard, content, width }) => {
    return (
        <div className={`pb-16px bg-white rounded-custom-ssm overflow-hidden border-1 border-gray-border ${width}`}>
            <div className={`text-fs-22 font-semibold py-16px ps-16px ${gradientType} text-black-500`}>
                {nameBoard}
            </div>
            <div className="border-t-1 border-gray-border pb-16px"></div>
            {content}
        </div>
    )
}

export { Board };