import { TradingBoard } from "../components/TradingBoard"
import { Tab, TabPanel, Tabs, TabsBody, TabsHeader } from "@material-tailwind/react";

const data = [
  {
    label: "SWAP",
    value: "swap",
    desc: `It really matters and then like it really doesn't matter.
    What matters is the people who are sparked by it. And the people 
    who are like offended by it, it doesn't matter.`,
  },
  {
    label: "SEND",
    value: "send",
    desc: `Because it's about motivating the doers. Because I'm here
    to follow my dreams and inspire other people to follow their dreams, too.`,
  }
];

const Swap = () => {
  return (
    <div className="bg-gray-100 flex justify-center pt-5 h-full">
      <Tabs value="swap">
        <TabsHeader>
          {data.map(({ label, value }) => (
            <Tab key={value} value={value}>
              {label}
            </Tab>
          ))}
        </TabsHeader>
        <TabsBody>
          {data.map(({ value, desc }) => (
            <TabPanel key={value} value={value}>
              <TradingBoard />
            </TabPanel>
          ))}
        </TabsBody>
      </Tabs>
    </div>
  )
}

export { Swap }