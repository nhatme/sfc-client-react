import { useState } from 'react'
import { Button, Card, Menu, MenuHandler, MenuItem, MenuList, Typography } from '@material-tailwind/react'
import { ChevronDownIcon, CursorArrowRaysIcon } from '@heroicons/react/24/outline';

const menuItems = [
    {
        title: "@material-tailwind/html",
        description:
            "Learn how to use @material-tailwind/html, packed with rich components and widgets.",
    },
    {
        title: "@material-tailwind/react",
        description:
            "Learn how to use @material-tailwind/react, packed with rich components for React.",
    },
    {
        title: "Material Tailwind PRO",
        description:
            "A complete set of UI Elements for building faster websites in less time.",
    },
];

const Dropdown = () => {
    const [open, setOpen] = useState(false);
    const [openMenu, setOpenMenu] = useState(false);
    const handleOpen = () => setOpen(!open);
    return (
        <Menu open={openMenu} handler={setOpenMenu} allowHover>
            <MenuHandler>
                <Button
                    variant="text"
                    className="flex items-center gap-3 text-base font-normal capitalize tracking-normal"
                    size='sm'
                >
                    Technology{" "}
                    <ChevronDownIcon
                        strokeWidth={2.5}
                        className={`h-3.5 w-3.5 transition-transform ${openMenu ? "rotate-180" : ""
                            }`}
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
                        Material Tailwind PRO
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