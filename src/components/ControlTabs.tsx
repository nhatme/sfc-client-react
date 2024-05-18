import { FC, useEffect, useState } from 'react'
import { ButtonBuilder } from './Button';
import { InputTargetAddress } from './Inputs';
import { useWallet } from '../hooks/useWallet';
import { openTokenAcc } from '../utils/Tokens';
import { PhantomWalletAdapter } from '@solana/wallet-adapter-phantom';

const ControlTabs: FC = () => {
    const { state } = useWallet();
    const userPublickey = state.myPublicKey.publicKey;
    const walletType = state.myPublicKey.walletType;
    const [buttonClicked, setButtonClicked] = useState<boolean>(false);
    const phantomAdapter = new PhantomWalletAdapter();

    const handleButtonClick = () => {
        setButtonClicked(true);
    };

    useEffect(() => {
        const connectAndOpenToken = async () => {
            if (buttonClicked && userPublickey && walletType) {
                if (!phantomAdapter.connected) {
                    await phantomAdapter.connect();
                }
                openTokenAcc(userPublickey, walletType);
            }  
        };

        connectAndOpenToken();
        setButtonClicked(false);
    }, [buttonClicked, userPublickey, walletType]);

    return (
        <div className='flex flex-col gap-10px'>
            <InputTargetAddress />
            <ButtonBuilder
                onClick={handleButtonClick}
                btnName="Open Token Account" btnType='circle'
                cursor='pointer' paddingSize='Large' sizeVariant='large'
                classNameCustom='bg-purple-500 text-white'
                border='gray-border'
            />
        </div>
    )
}

export { ControlTabs };