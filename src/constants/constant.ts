declare type variant = "h1" | "h2" | "h3" | "h4" | "h5" | "h6" | "lead" | "paragraph" | "small";
declare type sizeVariant = 'small' | 'medium' | 'large';
declare type paddingSizeButton = 'Small' | 'Medium' | 'Large';
declare type typeOfButton = 'circle' | 'circle-square';
declare type GradientType = 'bg-gradient-117-to-r' | 'bg-gradient-117-to-l';
declare type Cursor = 'pointer' | 'not-allowed';
declare type Border = 'gray-border' | 'black-border';
declare type WalletExtensionName = "Phantom" | "Okx" | "Solflare" | any;
declare type WalletWatching = "WALLET_EXTENSION_WATCHING";
declare type WalletPrevious = "open-wallet-previous";

export type {
    variant,
    sizeVariant,
    paddingSizeButton,
    typeOfButton,
    GradientType,
    Cursor,
    Border,
    WalletExtensionName,
    WalletWatching,
    WalletPrevious
}