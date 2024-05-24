import { FC, useEffect, useState } from 'react'
import { ButtonBuilder } from './Button';
import { InputTargetAddress } from './Inputs';
import { useWallet } from '../hooks/useWallet';
import { openTokenAcc } from '../utils/Tokens';
import { Bounce, ToastContainer, toast } from 'react-toastify';
import { notifyInfo } from '../notification/ToastMessage';

const ControlTabs: FC = () => {
    const { state, dispatch } = useWallet();
    const userPublickey = state.myPublicKey.publicKey;
    const walletType = state.myPublicKey.walletType;
    const [buttonClicked, setButtonClicked] = useState(false);
    const [tokenAccState, setTokenAccState] = useState(false);

    const handleButtonClick = () => {
        setButtonClicked(true);
    };

    useEffect(() => {
        (async () => {
            if (buttonClicked && userPublickey) {
                (async () => {
                    const tokenAccState = await openTokenAcc(userPublickey);
                    if (tokenAccState === true) {
                        setTokenAccState(tokenAccState);
                        dispatch({ type: 'UPDATE_TOKEN_ACCOUNT', payload: { openTokenAcc: true } });
                    }
                })();
            }
        })();
        setButtonClicked(false);
    }, [buttonClicked, userPublickey, walletType]);

    useEffect(() => {
        if (tokenAccState)
            notifyInfo(<h2>You have opened token account :D</h2>);
    }, [tokenAccState]);

    return (
        <>
            <div className='flex flex-col gap-10px'>
                <InputTargetAddress />
                {!tokenAccState && userPublickey ? (
                    <>
                        <ButtonBuilder
                            onClick={handleButtonClick}
                            btnName="Create Token SFC Account" btnType='circle'
                            cursor='pointer' paddingSize='Large' sizeVariant='large'
                            classNameCustom='bg-purple-500 text-white'
                            border='gray-border'
                        />
                        <div style={{ color: "red" }}>* You need to have SFC account first, to own SFC token</div>
                    </>
                ) : <div>

                </div>
                }
            </div>
            <ToastContainer position="bottom-center"
                autoClose={5000}
                hideProgressBar={false}
                newestOnTop={false}
                closeOnClick
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    )
}

export { ControlTabs };