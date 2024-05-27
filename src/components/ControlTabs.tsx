import React, { FC, forwardRef, useEffect, useState } from 'react'
import { ButtonBuilder } from './Button';
import { InputTargetAddress } from './Inputs';
import { useWallet } from '../hooks/useWallet';
import { openTokenAcc } from '../utils/Tokens';
import { Alert, Snackbar, AlertProps } from '@mui/material';

const ControlTabs: FC = () => {
    const { state, dispatch } = useWallet();
    const [open, setOpen] = useState(false);
    const userPublickey = state.myPublicKey.publicKey;
    const walletType = state.myPublicKey.walletType;
    const [buttonClicked, setButtonClicked] = useState(false);
    const [tokenAccState, setTokenAccState] = useState(false);

    const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
        function SnackbarAlert(props, ref) {
            return <Alert elevation={6} ref={ref} {...props} />
        }
    )

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
        if (reason === "clickaway") {
            return;
        }
        setOpen(false);
    }

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
                        setOpen(true);
                        dispatch({ type: 'UPDATE_TOKEN_ACCOUNT', payload: { openTokenAcc: true } });
                    }
                })();
            }
        })();
        setButtonClicked(false);
    }, [buttonClicked, userPublickey, walletType]);

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
                        {/* <div style={{ color: "red" }}>* You need to have SFC account first, to own SFC token</div> */}
                    </>
                ) : <div></div>}
            </div>
            <Snackbar open={open} autoHideDuration={5000} onClose={handleClose} anchorOrigin={{
                vertical: "bottom",
                horizontal: "center"
            }}>
                <SnackbarAlert onClose={handleClose} severity='info'>
                    You have opened token account!
                </SnackbarAlert>
            </Snackbar >
        </>
    )
}

export { ControlTabs };