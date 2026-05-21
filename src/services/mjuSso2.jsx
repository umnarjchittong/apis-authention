import { useEffect, useState } from "react";
import axios from "axios";
// import { useCookies } from "react-cookie";
import { Link, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
// import withReactContent from "sweetalert2-react-content";
// import { jose_encrypt } from "../../providers/JWT";
// import { useAuth } from "../../providers/AuthContext";
import LoadingSpinner from "../components/LoadingSpinner";
import { UseAuth } from "../providers/AuthContext";

const apiTokenAdmin = import.meta.env.VITE_API_TOKEN_ADMIN;
const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;
const clientId = import.meta.env.VITE_APP_MJU_SSO_CLIENT_ID;
// const BASE_URL = import.meta.env.VITE_BASE_URL;
const isDebug = false;

async function fetchMjuSsoUserInfo({
    clientId,
    code,
    Swal,
    handleSetLoadingStatus,
    setUserInfo,
}) {
    if (
        localStorage.getItem("mjuSsoUserInfo") &&
        JSON.parse(localStorage.getItem("mjuSsoUserInfo")).citizenID
    ) {
        setUserInfo(JSON.parse(localStorage.getItem("mjuSsoUserInfo")));
        return true;
    }

    try {
        const config = {
            method: "POST",
            url: "https://sso.mju.ac.th/token.aspx",
            headers: {
                "Content-Type": "application/json",
                "Access-Control-Allow-Origin": "*",
                // "User-Agent": "vscode-restclient",
            },
            data: {
                clientID: clientId,
                code: code,
            },
        };

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
                    parseInt(localStorage.getItem("MJUSSO_Attempt") || "0") + 1,
                );
                handleSetLoadingStatus(
                    "พยายามเชื่อมต่อกับเซิฟเวอร์ MJUSSO #" +
                        parseInt(localStorage.getItem("MJUSSO_Attempt") || "0"),
                    152,
                );
                // window.location.replace(
                //     `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=85`,
                // );
                // await Swal.fire({
                //   title: "E01 เกิดข้อผิดพลาด",
                //   text:
                //     "การเชื่อมต่อกับเซิฟเวอร์ MJUSSO status = fail. จำนวน " +
                //     localStorage.getItem("MJUSSO_Attempt") +
                //     " ครั้ง",
                //   icon: "warning",
                //   confirmButtonText: " SignIn อีกครั้ง ",
                // }).then((result) => {
                //   if (result.isConfirmed) {
                //     console.error("line 96 MJUSSO login fail please try again");
                //     // window.location.replace(
                //     //     `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=85`
                //     //   );
                //   }
                // });
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
            // } else {
            //   handleSetLoadingStatus("เชื่อมต่อกับเซิฟเวอร์ MJUSSO สำเร็จ", 199);
            //   showConsole && console.log("MJUSSO response success:");
        }

        handleSetLoadingStatus("เชื่อมต่อกับเซิฟเวอร์ MJUSSO สำเร็จ", 203);
        localStorage.removeItem("MJUSSO_Attempt");
        setUserInfo(!response?.data?.studentCode ? response.data : null);
        localStorage.setItem("mjuSsoUserInfo", JSON.stringify(response.data));
        // response && setUserInfo(response.data);
        showConsole && console.log(JSON.stringify(response.data));
        // return !response?.data?.studentCode ? true : false;
        let body = {};
        if (response?.data?.e_mail.toUpperCase().startsWith("MJU")) {
            showConsole &&
                console.log("MJUSSO userInfo is student:", response.data);
            showConsole &&
                console.log(
                    "E04 cannot read user account information",
                    clientId,
                    code,
                );
            body = {
                title: "login",
                method: "Authention with MJUSSO",
                status: "student",
                detail: JSON.stringify(response.data),
                user: response?.data?.e_mail,
            };
        }
        axios
            .post("https://apis.mju.ac.th/authention/v1/logs", body, {
                headers: {
                    Authorization: "Bearer " + apiTokenAdmin,
                },
            })
            .catch((error) => {
                showConsole && console.log("Failed to log error:", error);
            });
        return !response?.data?.e_mail.toUpperCase().startsWith("MJU")
            ? true
            : false;
    } catch (error) {
        handleSetLoadingStatus("พบปัญหาเกี่ยวกับการเชื่อมต่อ MJUSSO.", 208);
        localStorage.removeItem("MJUSSO_Attempt");
        showConsole && console.log(`MJUSSO err: ${error}`);
    }
}

async function onSignIn({
    userInfo,
    autoAddMember,
    autoUpdateMember,
    handleSetLoadingStatus,
    setMemberInfo,
}) {
    handleSetLoadingStatus("กำลังตรวจสอบข้อมูลผู้ใช้งาน", 274);

    // verify exist member
    userInfo &&
        showConsole &&
        console.log("%cuserInfo:", "color:lime", userInfo);
    if (userInfo && userInfo.member_citizenId) {
        autoAddMember(userInfo);
        handleSetLoadingStatus("ทำการเพิ่มข้อมูลผู้ใช้งานใหม่สำเร็จ", 229);
        setMemberInfo(JSON.parse(localStorage.getItem("memberInfo")));
        return true;
    }
    if (userInfo && userInfo.citizenID) {
        autoUpdateMember(userInfo);
        handleSetLoadingStatus("ทำการอัพเดทข้อมูลผู้ใช้งานสำเร็จ", 234);
        setMemberInfo(JSON.parse(localStorage.getItem("memberInfo")));
        return true;
    }
}

export default function MjuSsoLogin() {
    const navigate = useNavigate();
    const [loadingStatus, setLoadingStatus] = useState("กำลังรวบรวมข้อมูล");
    const [isLoaded, setIsLoaded] = useState(false);

    const [userInfo, setUserInfo] = useState("");
    // const [memberInfo, setMemberInfo] = useState();
    const { memberInfo, setMemberInfo } = UseAuth();
    const [tryAgainLink, setTryAgainLink] = useState(false);
    // let tryAgainLink = false;
    const [tryAgainCountDown, setTryAgainCountDown] = useState(5);

    // const { storeMember, signOut, randomString } = useAuth();

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
                setLoadingStatus("โหลดข้อมูลผู้ใช้สําเร็จ");
                showConsole &&
                    console.log("res โหลดข้อมูลผู้ใช้สำเร็จ:", response.data);
                console.log("MEMBER:", JSON.stringify(response.data));
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
        });
        showConsole &&
            console.log("%cautoUpdateMember data:", "color:red", data);

        const config = {
            method: "PATCH",
            baseURL: "https://apis.mju.ac.th/authention/v1/users",
            headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + apiTokenAdmin,
            },
            data: data,
        };
        showConsole && console.log("update user is exist:", JSON.parse(data));
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
                return response.data.data;
            })
            .catch((error) => {
                console.log("line 546:", error);
            });
    };

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
                setUserInfo: setUserInfo,
            }).then((res) => {
                if (!res && !localStorage.getItem("mjuSsoUserInfo")) {
                    setUserInfo(null);
                    Swal.fire({
                        title: "ขออภัย E04",
                        text: "คลิกปุ่ม Allow มุมบนซ้ายเพื่อใช้ระบบ หรือโปรดลองอีกครั้ง.",
                        icon: "warning",
                        confirmButtonText: " รับทราบ ",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            showConsole &&
                                console.warn("224 you are student go logout");
                            // window.location.replace("/");
                            // window.location.replace(
                            //     `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=226`,
                            // );
                        }
                    });
                }
            });
        }
    }, [clientId, code]);

    if (tryAgainCountDown === 0 && !tryAgainLink) setTryAgainLink(true);

    useEffect(() => {
        // Only set the timer if there is time left
        // if (tryAgainCountDown <= 0) setTryAgainLink(true);

        const timerId = setInterval(() => {
            setTryAgainCountDown((prev) => prev - 1);
        }, 1000);

        // Cleanup: Clear interval when component unmounts or before re-running
        return () => clearInterval(timerId);
    }, [tryAgainCountDown, tryAgainLink]); // Dependency ensures the logic checks if seconds reached 0

    useEffect(() => {
        !isLoaded &&
            userInfo &&
            userInfo?.citizenID &&
            onSignIn({
                userInfo: userInfo,
                autoAddMember: autoAddMember,
                autoUpdateMember: autoUpdateMember,
                handleSetLoadingStatus: handleSetLoadingStatus,
                setMemberInfo: setMemberInfo,
                Swal: Swal,
            }).then((result) => {
                if (result) {
                    console.log("line 273 onSignIn result: ", result);
                    handleSetLoadingStatus(
                        "โหลดข้อมูลผู้ใช้งานสำเร็จ กำลังเข้าสู่ระบบ...",
                        397,
                    );
                    handleSetIsLoaded(true);
                    showConsole && console.log("999 onSignIn result: ", result);
                    if (
                        result &&
                        !isDebug &&
                        memberInfo &&
                        localStorage.getItem("memberInfo")
                    ) {
                        localStorage.removeItem("mjuSsoUserInfo");
                        // navigate(`/`);
                    } else {
                        console.error(
                            "line 273 onSignIn failed to get memberInfo or localStorage memberInfo",
                            {
                                result,
                                memberInfo,
                                localStorageMemberInfo:
                                    localStorage.getItem("memberInfo"),
                            },
                        );
                    }
                    // if (result && !isDebug) window.location.replace(`/`);
                    //   showConsole && console.log("ready");
                    //   showConsole && console.log("isLoaded:", isLoaded);
                    // GotJwt({
                    //     userInfo: result,
                    //     handleSetLoadingStatus: handleSetLoadingStatus,
                    //     // storeMember: storeMember,
                    //     Swal: Swal,
                    //     signOut: signOut,
                    // }).then((result) => {
                    //     handleSetIsLoaded(true);
                    //     if (result && !isDebug) window.location.replace(`main`);
                    // });
                }
            });

        //   isLoaded && window.location.replace(`main`);
    }, [userInfo, isLoaded]);

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

            <div className="hidden">
                <div className="mt-10 flex justify-center gap-x-5">
                    <a
                        href={`https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=369`}
                        target="_top"
                    >
                        sign in
                    </a>
                    <Link
                        // href={`https://sso.mju.ac.th/signout.aspx?cid=${clientId}`}
                        target="_top"
                        onClick={() => {
                            // signOut();
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
