import { FC } from "react"
import { InputCustomProps } from "../interfaces/CustomProps"
import { ClipboardIcon } from "@heroicons/react/24/outline";
import { ButtonConfirm } from "./Button";

const InputCustom: FC<InputCustomProps> = ({ className, label, dropdown, unitCurrencyConverter, walletBalance, placeHolder, type, inputClassName }) => {
    return (
        <div className={`${className}`}>
            <label htmlFor="">{label}</label>
            <div className="flex justify-between items-center">
                <input spellCheck={false} type={type} placeholder={placeHolder} className={`${inputClassName} leading-none outline-none mt-2 text-black w-full`} />
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

const InputTargetAddress: FC = () => {
    return (
        <div className="flex gap-4px items-center">
            <div className="flex gap-6px items-center bg-white rounded-custom-md border-gray-border border-1 px-16px py-8px shadow-md">
                <div>
                    <input className="text-fs-20 leading-lh-100 font-bold italic outline-none text-primary-color" spellCheck="false" type="text" placeholder="type or paste here..." />
                </div>
                <ClipboardIcon className="h-6 w-6 text-primary-color hover:cursor-pointer" />
            </div>
            <ButtonConfirm btnName="Confirm change?" />
        </div>
    )
}

export { InputCustom, InputTargetAddress }