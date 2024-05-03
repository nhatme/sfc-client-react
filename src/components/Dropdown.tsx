import { useState, FC } from 'react'
import { Button, Card, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react'
import { ChevronDownIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';
import { DropdownCustomName } from '../interfaces/CustomProps';

const menuItems = [
    {
        title: "Solana",
        description:
            "Bring blockchain to the people. Solana supports experiences for power users, new consumers, and everyone in between.",
    },
    {
        title: "Solana",
        description:
            "Bring blockchain to the people. Solana supports experiences for power users, new consumers, and everyone in between.",
    },
    {
        title: "Solana",
        description:
            "Bring blockchain to the people. Solana supports experiences for power users, new consumers, and everyone in between.",
    },
];

const Dropdown: FC<DropdownCustomName> = ({ dropdownName }) => {
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const handleOpen = () => setOpen(!open);
    return (
        <Menu open={openMenu} handler={setOpenMenu}>
            <MenuHandler>
                <Button
                    variant="text"
                    className="flex items-center gap-3 text-base font-normal capitalize tracking-normal"
                    size='sm'
                >
                    <p className='font-bold'>{dropdownName}</p>{" "}
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""}`}
                    />
                </Button>
            </MenuHandler>
            <MenuList className="hidden w-[36rem] grid-cols-7 gap-3 overflow-visible lg:grid">
                <Card
                    color="gray"
                    shadow={false}
                    className="col-span-3 flex h-full w-full items-center justify-center rounded-2xl p-4"
                >
                    <CursorArrowRaysIcon strokeWidth={1} className="h-10 w-10" />
                    <Typography className="mt-5 text-center" variant="h5">
                        Solana PRO
                    </Typography>
                </Card>
                <ul className="col-span-4 flex w-full flex-col gap-1">
                    {menuItems.map(({ title, description }) => (
                        <a href="#" key={title}>
                            <MenuItem>
                                <Typography variant="h6" color="blue-gray" className="mb-1">
                                    {title}
                                </Typography>
                                <Typography
                                    variant="small"
                                    color="gray"
                                    className="font-normal"
                                >
                                    {description}
                                </Typography>
                            </MenuItem>
                        </a>
                    ))}
                </ul>
            </MenuList>
        </Menu>
    )
}

export { Dropdown }