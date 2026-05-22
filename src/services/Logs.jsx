import axios from "axios";
import dayjs from "dayjs";
const apiTokenAdmin = import.meta.env.VITE_API_TOKEN_ADMIN;
const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;

export default function createLog({
    title = "login",
    method = "Authention with MJUSSO",
    status = "failed",
    detail = "",
    meta = "",
    user = "",
}) {
    const body = JSON.stringify({
        title: title,
        method: method,
        status: status,
        detail: detail,
        meta: meta,
        user: user,
    });

    const config = {
        method: "POST",
        baseURL: "https://apis.mju.ac.th/authention/v1/logs",
        headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + apiTokenAdmin,
        },
        data: body,
    };
    axios
        .request(config)
        .then(() => {
            showConsole &&
                console.log(
                    "%cLog created successfully:",
                    "color:lime",
                    dayjs().unix(),
                );
        })
        .catch((error) => {
            showConsole &&
                console.log(
                    "%cFailed to log error:",
                    "color:red",
                    dayjs().unix(),
                    error,
                    body,
                );
        });
}
