import { FC, useState } from "react";
import { Select, Option } from "@material-tailwind/react";
import { SelectProps } from "../interfaces/CustomProps";

const ControlledSelect: FC<SelectProps> = ({ className }) => {
    const [value, setValue] = useState<string | undefined>(undefined);

    return (
        <div className={`w-72 ${className}`}>
            <Select
                label="Select Version"
                value={value}
                onChange={(val) => setValue(val)}
            >
                <Option value="html">Material Tailwind HTML</Option>
                <Option value="react">Material Tailwind React</Option>
                <Option value="vue">Material Tailwind Vue</Option>
                <Option value="angular">Material Tailwind Angular</Option>
                <Option value="svelte">Material Tailwind Svelte</Option>
            </Select>
        </div>
    );
}

export default ControlledSelect;