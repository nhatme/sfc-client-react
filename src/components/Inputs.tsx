import { FC } from "react"
import { InputCustomProps } from "../interfaces/CustomProps"

const InputCustom: FC<InputCustomProps> = ({ className, label, dropdown, unitCurrencyConverter, walletBalance, placeHolder, type, inputSize }) => {
    return (
        <div className={`${className}`}>
            <label htmlFor="">{label}</label>
            <div className="flex justify-between items-center">
                <input type={type} placeholder={placeHolder} className={`${inputSize} leading-none outline-none mt-2 text-black w-full bg-gray-100`} />
                <div>
                    {dropdown}
                </div>
            </div>
            <div className="flex justify-between mt-2">
                <div>{unitCurrencyConverter}</div>
                <div className="text-gray-500">{walletBalance}</div>
            </div>
        </div>
    )
}

export { InputCustom }