import { Alert, AlertProps, Snackbar, SnackbarCloseReason } from '@mui/material'
import { ReactNode, forwardRef } from 'react'

interface SnackbarComponentProps {
    open: boolean;
    severity: 'success' | 'error' | 'info';
    message: ReactNode;
    autoHideDuration?: number;
    onClose: (event?: React.SyntheticEvent | Event, reason?: SnackbarCloseReason) => void;
}

const SnackbarAlert = forwardRef<HTMLDivElement, AlertProps>(
    function SnackbarAlert(props, ref) {
        return <Alert elevation={6} ref={ref} {...props} />
    }
)

const SnackbarComponent: React.FC<SnackbarComponentProps> = ({ open, severity, message, autoHideDuration = 10000, onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={autoHideDuration}
            onClose={onClose}
            anchorOrigin={{
                vertical: "top",
                horizontal: "center"
            }}
        >
            <SnackbarAlert onClose={onClose} severity={severity}>
                {message}
            </SnackbarAlert>
        </Snackbar>
    );
};

export default SnackbarComponent;