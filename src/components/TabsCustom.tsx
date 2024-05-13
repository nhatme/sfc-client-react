import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { FC, useState } from "react";
import { TabsCustom } from "../interfaces/CustomProps";
import { InputCustom } from "./Inputs";

const TransparentTabs: FC<TabsCustom> = ({ data }) => {
    const [stateTarget, setStateTarget] = useState<string | undefined>(data[0].target);

    return (
        <Tabs value={stateTarget} className="max-w-full">
            <TabsHeader
                className="bg-transparent p-0 py-2"
                indicatorProps={{
                    className: "bg-gray-900/10 shadow-none !text-gray-900",
                }}
            >
                {data && data.map(({ label, value, target }, index) => (
                    <Tab className="" key={value} value={value} onClick={() => setStateTarget(target)}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
            {(stateTarget === "target") && (
                <div>
                    <InputCustom placeHolder="Paste target address here" inputClassName="bg-gray-300" className="flex flex-col bg-gray-300 px-4 rounded-lg w-1/3" type="text" />
                </div>
            )}
            <TabsBody>
                {data && data.map(({ value, content }, index) => (
                    <TabPanel className="py-2 px-0" key={value} value={value}>
                        {content}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}

const TabsDefault: FC<TabsCustom> = ({ data }) => {
    return (
        <Tabs value="html">
            <TabsHeader>
                {data.map(({ label, value }) => (
                    <Tab key={value} value={value}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
            <TabsBody>
                {data.map(({ value, content }) => (
                    <TabPanel key={value} value={value}>
                        {content}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}

export { TransparentTabs, TabsDefault };
