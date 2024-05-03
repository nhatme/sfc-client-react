import {
    Tabs,
    TabsHeader,
    TabsBody,
    Tab,
    TabPanel,
} from "@material-tailwind/react";
import { FC } from "react";
import { TransparentTabsCustom } from "../interfaces/CustomProps";

const TransparentTabs: FC<TransparentTabsCustom> = ({ data }) => {
    return (
        <Tabs value={data[0].value} className="max-w-full">
            <TabsHeader
                className="bg-transparent"
                indicatorProps={{
                    className: "bg-gray-900/10 shadow-none !text-gray-900",
                }}
            >
                {data && data.map(({ label, value }, index) => (
                    <Tab key={value} value={value}>
                        {label}
                    </Tab>
                ))}
            </TabsHeader>
            <div>address wallet</div>
            <TabsBody
                animate={{
                    initial: { y: 250 },
                    mount: { y: 0 },
                    unmount: { y: 300 },
                }}>
                {data && data.map(({ value, desc }, index) => (
                    <TabPanel className="py-2 px-0" key={value} value={value}>
                        {desc}
                    </TabPanel>
                ))}
            </TabsBody>
        </Tabs>
    );
}

export default TransparentTabs;