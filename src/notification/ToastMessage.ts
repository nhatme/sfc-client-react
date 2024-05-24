import { Bounce, toast } from "react-toastify";

const notifySuccess = (message: JSX.Element) => {
    toast.success(message,
        {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        }
    );
}

const notifyError = (message: JSX.Element) => {
    toast.error(message,
        {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        }
    );
}

const notifyProcess = (message: JSX.Element) => {
    toast.loading(message, {
        position: "bottom-left",
        autoClose: 5000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: false,
        progress: undefined,
        theme: "colored",
        transition: Bounce,
    })
}


const notifyInfo = (message: JSX.Element) => {
    toast.info(message,
        {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        }
    );
}

const notifyWarning = (message: JSX.Element) => {
    toast.warn(message,
        {
            position: "bottom-left",
            autoClose: 5000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: false,
            progress: undefined,
            theme: "colored",
            transition: Bounce,
        }
    );
}

export { notifySuccess, notifyError, notifyProcess, notifyInfo }