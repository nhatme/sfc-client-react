import { Cog6ToothIcon } from "@heroicons/react/24/outline";
import { Button, Card, CardBody, CardFooter, CardHeader, IconButton, Menu, MenuHandler, MenuItem, MenuList } from "@material-tailwind/react";
import { Dropdown } from "./Dropdown";

const TradingBoard = () => {
    return (
        <Card className="w-1/2">
            <CardHeader
                className="p-6 place-items-center"
            >
                <div className="flex justify-between items-center">
                    <div className="flex gap-4">
                        <div>
                            <Button className="rounded-full bg-gray-200 text-gray-700">
                                Swap
                            </Button>
                        </div>
                        <div>
                            <Button className="rounded-full text-gray-700" color="white">
                                Send
                            </Button>
                        </div>
                    </div>
                    <Menu>
                        <MenuHandler>
                            <IconButton
                                color="blue-gray"
                                size="sm"
                                variant="text"
                            >
                                <Cog6ToothIcon className="h-6 w-6 text-gray-500" />
                            </IconButton>
                        </MenuHandler>
                        <MenuList>
                            <MenuItem>Menu Item 1</MenuItem>
                            <MenuItem>Menu Item 2</MenuItem>
                        </MenuList>
                    </Menu>
                </div>
            </CardHeader>
            <CardBody className="flex flex-col gap-4">
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
                <div className="flex flex-col bg-gray-100 p-4 rounded-lg">
                    <label htmlFor="you pay">You receive</label>
                    <div className="flex justify-between">
                        <input type="number" name="you pay" placeholder="0" className="text-4xl outline-none mt-2 text-black w-full bg-gray-100" />
                        <div>
                            <Dropdown dropdownName={"SFC"} />
                        </div>
                    </div>
                    <div className="flex justify-between mt-2">
                        <div>$999.98 </div>
                        <div className="text-gray-500">Balance: 1000</div>
                    </div>
                </div>
            </CardBody>
            <CardFooter className="pt-0">
                <Button variant="gradient" fullWidth color="gray" disabled>
                    Enter an amount
                </Button>
            </CardFooter>
        </Card>
    );
}


export { TradingBoard }