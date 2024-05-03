export interface CardsProps {
    className?: string,
    nameCard: string,
    buttons?: ButtonProps[],
    typograph?: JSX.Element,
    cardFooter?: JSX.Element
}

export interface ButtonProps {
    label: string,
    onClick: () => void,
    className?: string
}

export interface DropdownCustomName {
    dropdownName: String
}