import axios from "axios";
import { createContext, useContext, useState } from "react";

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
    const [responseTime, setResponseTime] = useState({});
    const [tokenCreated, setTokenCreated] = useState(null);

    const createLog = (
        body = {
            title: "login",
            method: "Authention with MJUSSO",
            status: "student",
            detail: "",
            user: "",
        },
    ) => {
        axios
            .post("https://apis.mju.ac.th/authention/v1/logs", body, {
                headers: {
                    Authorization: "Bearer " + apiTokenAdmin,
                },
            })
            .catch((error) => {
                showConsole && console.log("Failed to log error:", error);
            });
    };

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
            .then((res) => setResponseTime({ ...responseTime, [ApiName]: res.duration }));
    };

    const tokenCreatedClear = () => {
        setTokenCreated(null);
    }

    const generateToken = (beginStr = "") => {
        // Simulate token generation logic here
        // const token = crypto.randomBytes(32).toString("hex");
        if (tokenCreated) return tokenCreated;

        const token = beginStr + crypto.getRandomValues(new Uint8Array(16)).reduce((str, byte) => str + byte.toString(16).padStart(2, '0'), '');
        console.log("Generated token:", token);
        setTokenCreated(token);
        return token;
    }

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
            value={{ memberInfo, setMemberInfo, signOut, createLog, endpointStatus, responseTime, generateToken, tokenCreated, tokenCreatedClear, apiTokenAdmin }}
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
