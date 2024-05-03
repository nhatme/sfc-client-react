export interface CardsProps {
    className?: string,
    nameCard: string,
    buttons?: ButtonProps[],
    inputBox?: JSX.Element,
    typograph?: JSX.Element,
    cardFooter?: JSX.Element
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
    inputSize?: string,
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
    desc: JSX.Element
}