function prettierPublickey(publicKey: string): string {
    const first = publicKey.substring(0, 5);
    const last = publicKey.slice(-5);
    return first + "....." + last;
}

const copyClipboard = (phantomPublickey: string | undefined): any => {
    if (phantomPublickey) {
        return navigator.clipboard.writeText(phantomPublickey).catch(err => console.error('Failed to copy text: ', err));
    }
}

export { prettierPublickey, copyClipboard };