import axios from "axios";
import { createContext, useContext, useState } from "react";
import { toastAlert } from "../services/SweetAlert";

const AuthContext = createContext("");
const clientId = import.meta.env.VITE_APP_MJU_SSO_CLIENT_ID;
const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;

export const AuthProvider = ({ children }) => {
    const apiTokenAdmin = import.meta.env.VITE_API_TOKEN_ADMIN;
    const [memberInfo, setMemberInfo] = useState(
        localStorage.getItem("memberInfo")
            ? JSON.parse(localStorage.getItem("memberInfo"))
            : null,
    );
    const [securityLogs, setSecurityLogs] = useState(
        localStorage.getItem("securityLogs")
            ? JSON.parse(localStorage.getItem("securityLogs"))
            : null,
    );
    const [responseTime, setResponseTime] = useState({});
    const [tokenCreated, setTokenCreated] = useState(null);

    const endpointStatus = (ApiName, ApiUrl) => {
        // Add a request interceptor to store the start time
        axios.interceptors.request.use((config) => {
            config.metadata = { startTime: new Date() };
            return config;
        });

        // Add a response interceptor to calculate the duration
        axios.interceptors.response.use((response) => {
            response.duration = new Date() - response.config.metadata.startTime;
            return response;
        });

        // Usage
        axios
            .get(ApiUrl)
            .then((res) =>
                setResponseTime({ ...responseTime, [ApiName]: res.duration }),
            );
    };

    const tokenCreatedClear = () => {
        setTokenCreated(null);
    };

    const generateToken = (beginStr = "") => {
        // Simulate token generation logic here
        // const token = crypto.randomBytes(32).toString("hex");
        if (tokenCreated) return tokenCreated;

        const token =
            beginStr +
            crypto
                .getRandomValues(new Uint8Array(16))
                .reduce(
                    (str, byte) => str + byte.toString(16).padStart(2, "0"),
                    "",
                );
        console.log("Generated token:", token);
        setTokenCreated(token);
        return token;
    };

    const reloadMemberInfo = async () => {
        const config = {
            method: "get",
            baseURL:
                "https://apis.mju.ac.th/authention/v1/userInfo/" +
                memberInfo.citizenID,
            headers: {
                Authorization: "Bearer " + apiTokenAdmin,
            },
        };
        const memInfo = await axios
            .request(config)
            .then((response) => {
                showConsole &&
                    console.log(
                        "%cfetchMemberInfo response:",
                        "color:blue",
                        response.data,
                    );
                if (response?.data && response?.data?.data?.citizenID) {
                    toastAlert({
                        title: "โหลดข้อมูลสมาชิกสำเร็จ",
                        icon: "success",
                        log_title : "Member Info",
                        log_method : "GET",
                        log_status : "success",
                        log_detail : "Successfully loaded member information.",
                        log_meta : JSON.stringify(response.data.data),
                        log_user : memberInfo?.email || "unknown",
                    });
                    localStorage.setItem(
                        "memberInfo",
                        JSON.stringify(response.data.data),
                    );
                    setMemberInfo(response.data.data);
                    return response.data.data;
                } else {
                    toastAlert({
                        title: "โหลดข้อมูลสมาชิกล้มเหลว",
                        icon: "error",
                        log_title : "Member Info",
                        log_method : "GET",
                        log_status : "error",
                        log_detail : "Failed to load member information.",
                        log_meta : JSON.stringify(config),
                        log_user : memberInfo?.email || "unknown",
                    });
                    showConsole &&
                        console.log(
                            "Failed to reload member info: Invalid response data",
                            response.data,
                        );
                    return null;
                }
            })
            .catch((error) => {
                showConsole &&
                    console.log("Failed to reload member info:", error);
                return null;
            });
        return memInfo;
    };

    const reloadSecurityLogs = async (limit = 300) => {
        const config = {
            method: "get",
            baseURL: `https://apis.mju.ac.th/authention/v1/logs?limit=${limit}`,
            headers: {
                Authorization: "Bearer " + apiTokenAdmin,
            },
        };
        const logs = await axios
            .request(config)
            .then((response) => {
                showConsole &&
                    console.log(
                        "%cfetchSecurityLogs response:",
                        "color:blue",
                        response.data,
                    );
                if (response?.data && response?.data?.status === "success") {
                    toastAlert({
                        title: "โหลดข้อมูล securityLogs สำเร็จ",
                        icon: "success",
                        log_title : "Security Logs",
                        log_method : "GET",
                        log_status : "success",
                        log_detail : "Successfully loaded security logs.",
                        log_meta : `Loaded ${response.data.data.length} logs with limit ${limit}`,
                        log_user : memberInfo?.email || "unknown",
                    });
                    localStorage.setItem(
                        "securityLogs",
                        JSON.stringify(response.data.data),
                    );
                    setSecurityLogs(response.data.data);
                    return response.data.data;
                } else {
                    toastAlert({
                        title: "โหลดข้อมูล securityLogs ล้มเหลว",
                        icon: "error",
                        log_title : "Security Logs",
                        log_method : "GET",
                        log_status : "error",
                        log_detail : "Failed to load security logs.",
                        log_meta : JSON.stringify(config),
                        log_user : memberInfo?.email || "unknown",
                    });
                    showConsole &&
                        console.log(
                            "Failed to reload securityLogs: Invalid response data",
                            response.data,
                        );
                    return null;
                }
            })
            .catch((error) => {
                showConsole &&
                    console.log("Failed to reload securityLogs:", error);
                return null;
            });
        return logs;
    };

    const signOut = async () => {
        setMemberInfo(null);
        await sessionStorage.clear();
        await localStorage.clear();
        window.location.replace(
            `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=016`,
        );
        return { success: true };
    };

    return (
        <AuthContext.Provider
            value={{
                memberInfo,
                setMemberInfo,
                signOut,
                endpointStatus,
                responseTime,
                generateToken,
                tokenCreated,
                tokenCreatedClear,
                apiTokenAdmin,
                reloadMemberInfo,
                securityLogs,
                reloadSecurityLogs,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const UseAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("UseAuth must be used within an AuthProvider");
    }
    return context;
};
