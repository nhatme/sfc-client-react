type variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "lead" | "paragraph" | "small";

export interface CardsProps {
    className?: string,
    nameCard: string,
    buttons?: ButtonProps[],
    inputBox?: JSX.Element,
    typograph?: JSX.Element,
    cardFooter?: JSX.Element,
    variant: variant | undefined,
    selectOptions?: JSX.Element
}

export interface ButtonProps {
    label: string,
    onClick: () => void,
    className?: string
}

export interface DropdownCustomName {
    dropdownName: string
}

export interface InputCustomProps {
    className?: string,
    label?: string,
    type: string,
    inputClassName?: string,
    dropdown?: JSX.Element,
    unitCurrencyConverter?: string,
    walletBalance?: string,
    placeHolder?: string
}

export interface TransparentTabsCustom {
    data: TabProps[]
}

export interface TabProps {
    label: string,
    value: string,
    desc: JSX.Element,
    target?: string
}

export interface SelectProps {
    className?: string
}