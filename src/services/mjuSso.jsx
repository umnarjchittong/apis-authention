import { useEffect, useState } from "react";
import axios from "axios";
import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import LoadingSpinner from "../components/LoadingSpinner";
import { UseAuth } from "../providers/AuthContext";
import createLog from "./Logs";
import { alertError } from "./SweetAlert";

const apiTokenAdmin = import.meta.env.VITE_API_TOKEN_ADMIN;
const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;
const clientId = import.meta.env.VITE_APP_MJU_SSO_CLIENT_ID;
const isDebug = false;

export default function MjuSsoLogin() {
    const [loadingStatus, setLoadingStatus] = useState("กำลังรวบรวมข้อมูล");
    const [isLoaded, setIsLoaded] = useState(false);
    const [SSOuserInfo, setSSOUserInfo] = useState("");
    const { memberInfo, setMemberInfo, signOut } = UseAuth();
    const [tryAgainLink, setTryAgainLink] = useState(false);
    const [tryAgainCountDown, setTryAgainCountDown] = useState(5);
    const navigate = useNavigate();

    let code = new URLSearchParams(window.location.search).get("ac");
    !(code && code.length === 32) && (code = "");

    const handleSetLoadingStatus = (message, formCodeLine = null) => {
        if (formCodeLine) {
            showConsole &&
                console.log(
                    "%cLine:",
                    "color:lime",
                    formCodeLine,
                    "\n" + "IsLoadingStatus:",
                    message,
                );
        } else {
            showConsole && console.log("IsLoadingStatus:", message);
        }
        setLoadingStatus(message);
    };

    const handleSetIsLoaded = (value) => {
        showConsole && console.log("IsLoaded:", value);
        setIsLoaded(value);
    };

    const autoAddMember = (userInfo) => {
        const data = JSON.stringify({
            citizenID: userInfo.citizenID,
            email: userInfo.e_mail,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            position: userInfo.position,
            department: userInfo.section || userInfo.division,
            faculty:
                userInfo?.faculty ||
                userInfo?.section ||
                userInfo?.division ||
                "ไม่ระบุ",
            avatar: userInfo.personnelPhoto
                ? encodeURIComponent(
                      "https://personnel.mju.ac.th/photomju/" +
                          userInfo.personnelPhoto,
                  )
                : encodeURIComponent("/user_default.png"),
        });

        const config = {
            method: "POST",
            baseURL: "https://apis.mju.ac.th/authention/v1/users",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiTokenAdmin,
            },
            data: data,
        };
        showConsole && console.log("verify user is exist:", config);
        axios
            .request(config)
            .then((response) => {
                // setLoadingStatus("โหลดข้อมูลผู้ใช้สําเร็จ");
                showConsole &&
                    console.log(
                        "res โหลดข้อมูลผู้ใช้สำเร็จ:",
                        response.data.data,
                    );
                console.log("memberInfo:", JSON.stringify(response.data.data));
                handleSetLoadingStatus("สร้างข้อมูลผู้ใช้ใหม่สําเร็จ", 195);
                handleSetIsLoaded(true);
                createLog({
                    title: "add member info",
                    method: "post",
                    status: "success",
                    detail: "add new member info with MJUSSO",
                    meta: JSON.stringify(response?.data?.data) || "",
                    user: response?.data?.data?.email || "unknown",
                });
            })
            .catch((error) => {
                console.log("line 493:", error);
            });
    };

    const autoUpdateMember = (userInfo) => {
        showConsole &&
            console.log("%cautoUpdateMember userInfo:", "color:red", userInfo);
        const data = JSON.stringify({
            citizenID: userInfo.citizenID,
            email: userInfo.e_mail,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            position: userInfo.position || "",
            department: userInfo.section || userInfo.division || "",
            faculty:
                userInfo?.faculty ||
                userInfo?.section ||
                userInfo?.division ||
                "ไม่ระบุ",
            avatar: userInfo.personnelPhoto
                ? encodeURIComponent(
                      "https://personnel.mju.ac.th/photomju/" +
                          userInfo.personnelPhoto,
                  )
                : encodeURIComponent("/user_default.png"),
        });
        showConsole &&
            console.log(
                "%cautoUpdateMember data:",
                "color:red",
                JSON.parse(data),
            );

        const config = {
            method: "PATCH",
            baseURL: "https://apis.mju.ac.th/authention/v1/users",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiTokenAdmin,
            },
            data: data,
        };
        showConsole && console.log("update user is exist json:", data);
        axios
            .request(config)
            .then((response) => {
                setLoadingStatus("อัพเดทข้อมูลผู้ใช้สําเร็จ");
                // console.log("MEMBER:", JSON.stringify(response.data.data));
                localStorage.setItem(
                    "memberInfo",
                    JSON.stringify(response.data.data),
                );
                showConsole &&
                    console.log(
                        "res อัพเดทข้อมูลผู้ใช้สําเร็จ:",
                        response.data,
                    );
                handleSetIsLoaded(true);
                createLog({
                    title: "update member info",
                    method: "patch",
                    status: "success",
                    detail: "update member info with MJUSSO",
                    meta: JSON.stringify(response.data.data),
                    user: response?.data?.data?.email || "unknown",
                });
                return response.data.data;
            })
            .catch((error) => {
                console.log("line 546:", error);
            });
    };

    // useEffect(() => {
    //     if (
    //         memberInfo &&
    //         memberInfo.citizenID &&
    //         localStorage.getItem("memberInfo") &&
    //         JSON.parse(localStorage.getItem("memberInfo")).citizenID ===
    //             memberInfo.citizenID
    //     ) {
    //         // autoAddMember(memberInfo);
    //         // autoUpdateMember(memberInfo);
    //     }
    // }, [memberInfo]);

    const fetchMemberInfo = (citizenID) => {
        console.log(
            "fetchMemberInfo url:",
            "https://apis.mju.ac.th/authention/v1/userInfo/" + citizenID,
        );
        const config = {
            method: "GET",
            baseURL:
                "https://apis.mju.ac.th/authention/v1/userInfo/" + citizenID,
            headers: {
                Authorization: "Bearer " + apiTokenAdmin,
            },
        };
        const memInfo = axios
            .request(config)
            .then((response) => {
                console.log(
                    "%cfetchMemberInfo response:",
                    "color:blue",
                    response.data,
                );
                if (response?.data && response?.data?.data?.citizenID) {
                    handleSetLoadingStatus("โหลดข้อมูลผู้ใช้สําเร็จ", 195);
                    setMemberInfo(response.data.data);
                    localStorage.setItem(
                        "memberInfo",
                        JSON.stringify(response.data.data),
                    );
                    const mjuSsoUserInfo = JSON.parse(
                        localStorage.getItem("mjuSsoUserInfo"),
                    );
                    showConsole &&
                        console.log("mjuSsoUserInfo:", mjuSsoUserInfo);
                    autoUpdateMember(mjuSsoUserInfo);
                    return response.data.data;
                } else {
                    const mjuSsoUserInfo = JSON.parse(
                        localStorage.getItem("mjuSsoUserInfo"),
                    );
                    autoAddMember(mjuSsoUserInfo);
                    const memInfo = assignMemberInfo(mjuSsoUserInfo);
                    return memInfo;
                }
            })
            .catch((error) => {
                console.log("line 194:", error);
            });
        return memInfo;
    };

    const assignMemberInfo = (userInfo) => {
        const memInfo = {
            citizenID: userInfo.citizenID,
            email: userInfo.e_mail || userInfo.E_mail,
            firstname: userInfo.firstName,
            lastname: userInfo.lastName,
            position: userInfo.position,
            department: userInfo.section || userInfo.division,
            faculty:
                userInfo?.faculty ||
                userInfo?.section ||
                userInfo?.division ||
                "ไม่ระบุ",
            personnelPhoto: userInfo.personnelPhoto
                ? encodeURIComponent(
                      "https://personnel.mju.ac.th/photomju/" +
                          userInfo.personnelPhoto,
                  )
                : encodeURIComponent("/user_default.png"),
        };
        setMemberInfo(memInfo);
        localStorage.setItem("memberInfo", JSON.stringify(memInfo));
        showConsole && console.log("assignMemberInfo:", memInfo);
        return memInfo;
    };

    async function fetchMjuSsoUserInfo({
        clientId,
        code,
        Swal,
        handleSetLoadingStatus,
        setSSOUserInfo,
    }) {
        if (
            localStorage.getItem("mjuSsoUserInfo") &&
            JSON.parse(localStorage.getItem("mjuSsoUserInfo")).citizenID
        ) {
            const localUserInfo = JSON.parse(
                localStorage.getItem("mjuSsoUserInfo"),
            );
            setSSOUserInfo(localUserInfo);
            handleSetLoadingStatus(
                "โหลดข้อมูลผู้ใช้จาก Local Storage สำเร็จ",
                224,
            );
            return localUserInfo.citizenID || false;
        }

        const config = {
            method: "POST",
            url: "https://sso.mju.ac.th/token.aspx",
            headers: {
                "Content-Type": "application/json",
                // "Access-Control-Allow-Origin": "*",
                // "User-Agent": "vscode-restclient",
            },
            data: {
                clientID: clientId,
                code: code,
            },
        };

        try {
            const response = await axios.request(config);
            const mjuSsoAttemptLimit = 15;

            showConsole &&
                console.log("%cMJUSSO response:", "color:red", response.data);
            if (response?.data?.status === "fail") {
                if (
                    parseInt(localStorage.getItem("MJUSSO_Attempt") || "0") <
                    mjuSsoAttemptLimit
                ) {
                    localStorage.setItem(
                        "MJUSSO_Attempt",
                        parseInt(
                            localStorage.getItem("MJUSSO_Attempt") || "0",
                        ) + 1,
                    );
                    handleSetLoadingStatus(
                        "พยายามเชื่อมต่อกับเซิฟเวอร์ MJUSSO #" +
                            parseInt(
                                localStorage.getItem("MJUSSO_Attempt") || "0",
                            ),
                        218,
                    );
                    window.location.replace(
                        `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=85`,
                    );
                    return;
                } else {
                    handleSetLoadingStatus(
                        "พยายามเชื่อมต่อกับเซิฟเวอร์ MJUSSO เกินจำนวน " +
                            mjuSsoAttemptLimit +
                            " ครั้ง",
                        178,
                    );
                    await Swal.fire({
                        title: "เกิดข้อผิดพลาด",
                        text: "การเชื่อมต่อกับเซิฟเวอร์ MJUSSO เกิดข้อผิดพลาด โปรดลองอีกครั้ง.",
                        icon: "warning",
                        confirmButtonText: " ลองอีกครั้ง ",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // console.error("line 96 MJUSSO login fail please try again");
                            window.location.replace(
                                `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=96`,
                            );
                        }
                    });
                }
                return;
            }

            handleSetLoadingStatus("เชื่อมต่อกับเซิฟเวอร์ MJUSSO สำเร็จ", 342);
            localStorage.removeItem("MJUSSO_Attempt");
            setSSOUserInfo(response.data ? response.data : null);
            localStorage.setItem(
                "mjuSsoUserInfo",
                JSON.stringify(response.data),
            );
            // response && setUserInfo(response.data);
            // showConsole && console.log(JSON.stringify(response.data));
            // return !response?.data?.studentCode ? true : false;

            //todo check student or staff by email if email start with MJU is student
            if (
                !response?.data?.e_mail ||
                response?.data?.e_mail?.toUpperCase().startsWith("MJU")
            ) {
                handleSetLoadingStatus(
                    "ยังไม่อนุญาตให้นักศึกษาเข้าถึงระบบนี้",
                    336,
                );
                alertError({
                    title: "ขออภัย",
                    text: "ยังไม่อนุญาตให้นักศึกษาเข้าถึงระบบนี้",
                    url: `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=374`,
                    onClick: () => signOut(),
                    log_title: "MJUSSO",
                    log_method: "student",
                    log_status: "failed",
                    log_detail:
                        "ผู้ใช้ที่เข้าสู่ระบบเป็นนักศึกษา ไม่อนุญาตให้เข้าถึงระบบ",
                    log_meta: JSON.stringify(response.data) || "",
                    log_user: response?.data?.e_mail || "unknown",
                });
                showConsole &&
                    console.log("MJUSSO userInfo is student:", response.data);
                createLog({
                    title: "MJUSSO",
                    method: "authention",
                    status: "failed",
                    detail: "ผู้ใช้ที่เข้าสู่ระบบเป็นนักศึกษา ไม่อนุญาตให้เข้าถึงระบบ",
                    meta: JSON.stringify(response.data) || "",
                    user: response?.data?.e_mail || "unknown",
                });
                return false;
            }

            return response.data.citizenID;
        } catch (error) {
            alertError({
                title: "ขออภัย",
                text: "ยังไม่อนุญาตให้นักศึกษาเข้าถึงระบบนี้",
                url: `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=374`,
                onClick: () => signOut(),
                log_title: "MJUSSO",
                log_method: "post",
                log_status: "failed",
                log_detail: "พบปัญหาเกี่ยวกับการเชื่อมต่อ MJUSSO",
                log_meta: JSON.stringify({ clientId, code, config }) || "",
                log_user: "unknown",
            });
            handleSetLoadingStatus("พบปัญหาเกี่ยวกับการเชื่อมต่อ MJUSSO.", 208);
            localStorage.removeItem("MJUSSO_Attempt");
            console.error(`MJUSSO err: ${error}`);
        }
    }

    useEffect(() => {
        if (!clientId || !code) {
            window.location.replace(
                `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=585`,
            );
        }

        showConsole &&
            clientId &&
            code &&
            console.log("cliendID:", clientId, " code:", code);
        if (clientId && code) {
            fetchMjuSsoUserInfo({
                clientId: clientId,
                code: code,
                MySwal: Swal,
                handleSetLoadingStatus: handleSetLoadingStatus,
                setSSOUserInfo: setSSOUserInfo,
            }).then((res) => {
                if (res) {
                    console.log("%cres:", "color:pink", res);
                    // return;
                    fetchMemberInfo(res).then((memInfo) => {
                        if (memInfo && memInfo.citizenID) {
                            console.log("memInfo:", memInfo);
                        }
                    });
                    // assignMemberInfo(
                    //     JSON.parse(localStorage.getItem("mjuSsoUserInfo")),
                    // );
                } else if (!res && !localStorage.getItem("mjuSsoUserInfo")) {
                    setSSOUserInfo(null);
                    // Swal.fire({
                    //     title: "ขออภัย E04",
                    //     text: "คลิกปุ่ม Allow มุมบนซ้ายเพื่อใช้ระบบ หรือโปรดลองอีกครั้ง.",
                    //     icon: "warning",
                    //     confirmButtonText: " รับทราบ ",
                    // }).then((result) => {
                    //     if (result.isConfirmed) {
                    //         showConsole &&
                    //             console.warn("224 you are student go logout");
                    //         // window.location.replace("/");
                    //         // window.location.replace(
                    //         //     `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=226`,
                    //         // );
                    //     }
                    // });
                }
            });
        }
    }, [clientId, code]);

    useEffect(() => {
        const readyToGoApp = () => {
            createLog({
                title: "MJUSSO",
                method: "auth",
                status: "success",
                detail: "เข้าสู่ระบบด้วย MJUSSO สำเร็จ",
                meta: JSON.stringify(memberInfo) || "",
                user: memberInfo?.e_mail || "unknown",
            });
            handleSetLoadingStatus("กำลังเข้าสู่ระบบ", 259);
            localStorage.removeItem("mjuSsoUserInfo");
            window.location.replace("./");
        };

        !isDebug && isLoaded && readyToGoApp();
    }, [isLoaded, memberInfo]);

    return (
        <div className="w-full max-w-sm mx-auto h-screen flex flex-col justify-center -mt-20 text-center">
            <p className="text-4xl font-extrabold tracking-widest text-white mb-8 text-shadow-lg">
                APIs Authention
            </p>
            <div className="w-auto mx-auto mb-10">
                <LoadingSpinner />
            </div>
            <p className="text-sm md:text-lg font-normal text-gray-500 tracking-wider">
                {loadingStatus}
            </p>
            <p
                className={`${
                    tryAgainLink ? "block" : "hidden"
                } text-sm md:text-base font-normal mt-10 text-gray-500 tracking-wider`}
            >
                <a
                    href={`https://sso.mju.ac.th/signout.aspx?cid=${clientId}`}
                    className="text-error hover:underline"
                >
                    คลิกปุ่ม Allow มุมบนซ้ายเพื่อใช้ระบบ หรือโปรดลองอีกครั้ง
                </a>
                <br />
                <br />
                <a
                    href={`https://galaxy.maropost.com/kb/articles/2339-enabling-local-network-access-in-google-chrome-for-retail-express-pos`}
                    target="_blank"
                    className="text-tertiary hover:underline"
                >
                    วิธีตั้งค่า Network Settings
                </a>
            </p>

            <div className="">
                <div className="mt-10 flex justify-center gap-x-5">
                    <a
                        // href={`https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=369`}
                        href="#"
                        target="_top"
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            window.location.replace(
                                `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=465`,
                            );
                            console.log("sign out and clear sessionStorage");
                        }}
                    >
                        sign in
                    </a>
                    <Link
                        // href={`https://sso.mju.ac.th/signout.aspx?cid=${clientId}`}
                        // target="_top"
                        onClick={() => {
                            localStorage.clear();
                            sessionStorage.clear();
                            signOut();
                            window.location.replace(
                                `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=451`,
                            );
                            console.log("sign out and clear sessionStorage");
                        }}
                    >
                        sign out
                    </Link>
                </div>
                <div>
                    <Link to="/main" target="_blank">
                        home
                    </Link>
                </div>
            </div>
        </div>
    );
}
