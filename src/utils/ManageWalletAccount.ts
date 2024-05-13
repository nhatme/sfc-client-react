function prettierPublickey(publicKey: string): string {
    const first = publicKey.substring(0, 5);
    const last = publicKey.slice(-5);
    return first + "....." + last;
}

const copyClipboard = (phantomPublickey: string) => {
    phantomPublickey ? navigator.clipboard.writeText(phantomPublickey) : null;
}

export { prettierPublickey, copyClipboard };