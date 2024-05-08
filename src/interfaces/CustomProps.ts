declare type variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "lead" | "paragraph" | "small";
declare type sizeVariant = 'small' | 'medium' | 'large';
declare type paddingSizeButton = 'Small' | 'Medium' | 'Large';
declare type typeOfButton = 'circle' | 'circle-square';
declare type GradientType = 'bg-gradient-117-to-r' | 'bg-gradient-117-to-l';
declare type Cursor = 'pointer' | 'not-allowed';

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

export interface ButtonHeaderProps {
    buttonName: string,
    url: string
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

export interface BoardProps {
    gradientType?: GradientType,
    nameBoard: string,
    content?: JSX.Element,
    width: string
}

export interface StatusStProps {
    name: string,
    value?: string,
    unit?: string,
    icon?: JSX.Element
}

export interface ButtonBuilderProps {
    btnName: string,
    classNameCustom?: string,
    sizeVariant: sizeVariant,
    paddingSize: paddingSizeButton,
    btnType: typeOfButton,
    icon?: JSX.Element,
    cursor?: Cursor
}

export declare interface SizeButton {
    small: string,
    medium: string,
    large: string
}

function updateButtonPaddingAndRounded(btnType: typeOfButton): any {
    if (btnType === "circle") {
        return {
            sizeButtonPaddingLarge: {
                small: 'px-16px py-8px font-bold rounded-custom-xxl text-fs-sm', // Small variant classes
                medium: 'px-16px py-8px font-bold rounded-custom-xxl text-fs-md', // Medium variant classes
                large: 'px-16px py-8px font-bold rounded-custom-xxl text-fs-lg', // Large variant classes
            },
            sizeButtonPaddingMedium: {
                small: 'px-12px py-6px font-semibold rounded-custom-xxl text-fs-sm', // Small variant classes
                medium: 'px-12px py-6px font-semibold rounded-custom-xxl text-fs-md', // Medium variant classes
                large: 'px-12px py-6px font-semibold rounded-custom-xxl text-fs-lg', // Large variant classes
            },
            sizeButtonPaddingSmall: {
                small: 'px-8px py-4px font-bold rounded-custom-xxl text-fs-sm', // Small variant classes
                medium: 'px-8px py-4px font-bold rounded-custom-xxl text-fs-md', // Medium variant classes
                large: 'px-8px py-4px font-bold rounded-custom-xxl text-fs-lg', // Large variant classes
            }
        };
    } else if (btnType === "circle-square") {
        return {
            sizeButtonPaddingSmall: {
                small: 'p-6px font-bold rounded-custom-ssm text-fs-sm',
                medium: 'p-6px font-bold rounded-custom-ssm text-fs-md',
                large: 'p-6px font-bold rounded-custom-ssm text-fs-lg',
            }, sizeButtonPaddingMedium: {
                small: 'p-12px font-semibold rounded-custom-ssm text-fs-sm',
                medium: 'p-12px font-semibold rounded-custom-ssm text-fs-md',
                large: 'p-12px font-semibold rounded-custom-ssm text-fs-lg',
            }, sizeButtonPaddingLarge: {
                small: 'p-18px font-bold rounded-custom-ssm text-fs-sm',
                medium: 'p-18px font-bold rounded-custom-ssm text-fs-md',
                large: 'p-18px font-bold rounded-custom-ssm text-fs-lg',
            }
        };
    }
}

export { updateButtonPaddingAndRounded };