import { FC } from "react"
import { Dropdown } from "./Dropdown"

const InputCustom: FC = () => {
    return (
        <div className="flex flex-col bg-gray-100 p-4 rounded-lg">
            <label htmlFor="you pay">You pay</label>
            <div className="flex justify-between">
                <input type="number" name="you pay" placeholder="0" className="text-4xl outline-none mt-2 text-black w-full bg-gray-100" />
                <div>
                    <Dropdown dropdownName={"SOL"} />
                </div>
            </div>
            <div className="flex justify-between mt-2">
                <div>$185.66</div>
                <div className="text-gray-500">Balance: 1.3</div>
            </div>
        </div>
    )
}

export { InputCustom }