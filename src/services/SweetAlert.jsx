import Swal from "sweetalert2";
import createLog from "./Logs";

const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;

export const toastCopySuccess = ({
    title = "Copied to clipboard",
    icon = "success",
    timer = 1000,
    position = "top-end",
}) => {
    return Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    }).fire({
        icon: icon,
        title: title,
    });
};

export const toastAlert = ({
    title = "Copied to clipboard",
    icon = "success",
    timer = 1000,
    position = "top-end",
    log_title = "",
    log_method = "",
    log_status = "",
    log_detail = "",
    log_meta = "",
    log_user = "",
}) => {
    if (log_title && log_method && log_status) {
        createLog({
            title: log_title,
            method: log_method,
            status: log_status,
            detail: log_detail,
            meta: log_meta,
            user: log_user,
        });
    }
    return Swal.mixin({
        toast: true,
        position: position,
        showConfirmButton: false,
        timer: timer,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.onmouseenter = Swal.stopTimer;
            toast.onmouseleave = Swal.resumeTimer;
        },
    }).fire({
        icon: icon,
        title: title,
    });
};

export const alertError = ({
    title = "An error occurred",
    text = "",
    url = "",
    onClick = null,
    log_title = "",
    log_method = "",
    log_status = "",
    log_detail = "",
    log_meta = "",
    log_user = "",
}) => {
    if (log_title && log_method && log_status) {
        createLog({
            title: log_title,
            method: log_method,
            status: log_status,
            detail: log_detail,
            meta: log_meta,
            user: log_user,
        });
    }
    return Swal.fire({
        icon: "error",
        title: title,
        text: text,
    }).then(() => {
        if (url) {
            onClick && onClick();
            window.location.href = url;
        }
    });
};


export const confirmationDialog = ({
    icon = "warning",
    title = "Are you sure?",
    text = "You won't be able to revert this!",
    confirmButtonText = "Yes, delete it!",
    confirmButtonColor = "#3085d6",
    cancelButtonText = "Cancel",
    cancelButtonColor = "#d33",
    resTitle = "Deleted!",
    resText = "Your file has been deleted.",
    resIcon = "success",
    url = "",
    onClick = null,
    log_title = "",
    log_method = "",
    log_status = "",
    log_detail = "",
    log_meta = "",
    log_user = "",
}) => {
    // if (log_title && log_method && log_status) {
    //     createLog({
    //         title: log_title,
    //         method: log_method,
    //         status: log_status,
    //         detail: log_detail,
    //         meta: log_meta,
    //         user: log_user,
    //     });
    // }

    return Swal.fire({
        title: title,
        text: text,
        icon: icon,
        showCancelButton: true,
        confirmButtonColor: confirmButtonColor,
        cancelButtonColor: cancelButtonColor,
        confirmButtonText: confirmButtonText,
        cancelButtonText: cancelButtonText,
    }).then((result) => {
        if (result.isConfirmed)
            Swal.fire({
                title: resTitle,
                text: resText,
                icon: resIcon,
            }).then((res) => {
                if (res.isConfirmed) {
                    if (url) {
                        onClick && onClick();
                        window.location.href = url;
                    }
                }
            });
    });
};
