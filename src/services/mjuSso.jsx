import React, { useEffect, useState } from "react";
import axios from "axios";
// import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import LoadingSpinner from "../LoadingSpinner";
import { jose_encrypt } from "../../providers/JWT";
import { useAuth } from "../../providers/AuthContext";
import dayjs from "dayjs";

const showConsole = import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;
const clientId = import.meta.env.VITE_APP_MJU_SSO_CLIENT_ID;
// const BASE_URL = import.meta.env.VITE_BASE_URL;
const isDebug = false;

async function getMemberInfo({
  signToken,
  handleSetLoadingStatus,
  setMemberInfo,
}) {
  let instance;
  if (signToken.length === 13) {
    instance = axios.create({
      baseURL: "https://api.maejo.link/auth/",
      headers: {
        Citizenid: signToken,
        Authorization: "Bearer 0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
      },
    });
    showConsole &&
      console.log(
        "instance Citizenid data:",
        signToken,
        "baseURL:",
        "https://api.maejo.link/auth/"
      );
  } else {
    instance = axios.create({
      baseURL: "https://api.maejo.link/auth/",
      headers: {
        memberToken3: signToken,
        Authorization: "Bearer 0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
      },
    });
    showConsole &&
      console.log(
        "instance memberToken data:",
        signToken,
        "baseURL:",
        "https://api.maejo.link/auth/"
      );
  }
  handleSetLoadingStatus("กำลังโหลดข้อมูลสมาชิก", 55);
  // showConsole && console.log("IsLoadingStatus:", "getting member info2...");
  return instance.get().then((res) => {
    if (res?.data) {
      showConsole &&
        console.log("%cGetting a member data:", "color:yellow", res.data);
      setMemberInfo(res.data);
      handleSetLoadingStatus("โหลดข้อมูลสมาชิกสำเร็จ", 62);
      return res.data;
      // return true;
    }
    return false;
  });
}

const GotJwt = async ({
  userInfo,
  handleSetLoadingStatus,
  storeMember,
  MySwal,
  signOut,
}) => {
  try {
    handleSetLoadingStatus("กำลังเตรียมแอปพลิเคชัน", 79);
    const jwt = await jose_encrypt(userInfo);
    // setUserInfo(user);
    showConsole && console.log("%cuserInfo:", "color:lime", userInfo);
    showConsole && console.log("%cjwt:", "color:lime", jwt);

    const storeMemberResult = await storeMember(userInfo, jwt);
    showConsole &&
      console.log("%cstoreMemberResult:", "color:lime", storeMemberResult);
    if (storeMemberResult) {
      handleSetLoadingStatus("กำลังนำทางไปยังแอปพลิเคชัน", 99);
      localStorage.setItem(
        "isLoggedIn",
        parseInt(localStorage.getItem("isLoggedIn") || "0") + 1
      );
      return true;
    }
    const isLoggedInLimit = 10;
    if (localStorage.getItem("isLoggedIn") > isLoggedInLimit) {
      MySwal.fire({
        title: "เกิดข้อผิดพลาด",
        text: "การเข้าสู่ระบบผิดพลาด โปรดลองอีกครั้ง.",
        icon: "warning",
        confirmButtonText: " ลองอีกครั้ง ",
      }).then(() => {
        console.error("line 51 MJUSSO login fail please try again");
        window.location.replace(
          `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=51`
        );
        return;
      });
    }
  } catch (error) {
    console.error("Error generating JWT:", error);
    MySwal.fire({
      title: "เกิดข้อผิดพลาด",
      text: "ไม่สามารถสร้าง JWT ได้ โปรดลองอีกครั้ง.",
      icon: "error",
      confirmButtonText: " ปิด ",
    }).then(() => {
      signOut();
    });
  }
  return false;
};

const handleUpdateUserLinksCounter = (citizenId) => {
  showConsole &&
    console.log("%ccitizenId:", "color:pink; font-size:18px", citizenId);
  if (!citizenId) return false;
  const instant = axios.create({
    baseURL: "https://api.maejo.link/report/",
    headers: {
      Method: "updateUserLinksCounterByCitizenid",
      Citizenid: citizenId,
      Authorization: "Bearer " + "0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
    },
  });
  instant
    .patch()
    .then((res) => {
      if (!res.data) {
        return false;
      } else {
        localStorage.removeItem("userProfile");
        showConsole &&
          console.log(
            "%chandleUpdateUserLinksCounter:",
            "color:pink; font-size:18px",
            res
          );
        return true;
      }
    })
    .catch((err) => {
      showConsole && console.log("axios err: ", err);
    });
};

async function fetchMjuSsoUserInfo({
  clientId,
  code,
  MySwal,
  handleSetLoadingStatus,
  setUserInfo,
}) {
  try {
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

    const response = await axios.request(config);
    const mjuSsoAttemptLimit = 15;
    showConsole && console.log("%cMJUSSO response:", "color:red", response.data);
    if (response?.data && response?.data?.status === "fail") {
      if (
        parseInt(localStorage.getItem("MJUSSO_Attempt") || "0") <
        mjuSsoAttemptLimit
      ) {
        localStorage.setItem(
          "MJUSSO_Attempt",
          parseInt(localStorage.getItem("MJUSSO_Attempt") || "0") + 1
        );
        handleSetLoadingStatus(
          "พยายามเชื่อมต่อกับเซิฟเวอร์ MJUSSO #" +
            parseInt(localStorage.getItem("MJUSSO_Attempt") || "0") +
            1,
          152
        );
        window.location.replace(
          `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=85`
        );
        // await MySwal.fire({
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
          178
        );
        await MySwal.fire({
          title: "เกิดข้อผิดพลาด",
          text: "การเชื่อมต่อกับเซิฟเวอร์ MJUSSO เกิดข้อผิดพลาด โปรดลองอีกครั้ง.",
          icon: "warning",
          confirmButtonText: " ลองอีกครั้ง ",
        }).then((result) => {
          if (result.isConfirmed) {
            // console.error("line 96 MJUSSO login fail please try again");
            window.location.replace(
              `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=96`
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
    // response && setUserInfo(response.data);
    showConsole && console.log(JSON.stringify(response.data));
    // return !response?.data?.studentCode ? true : false;
    if (response?.data?.e_mail.toUpperCase().startsWith("MJU")) {
      showConsole && console.log("MJUSSO userInfo is student:", response.data);
      showConsole && console.log("E04 cannot read user account information", clientId, code);
      axios
        .post(
          "https://api.maejo.link/logs/",
          {
            type: "member",
            message: "MJUSSO userInfo is student",
            detail: JSON.stringify(response.data),
          },
          {
            headers: {
              Method: "create",
              Authorization: "Bearer 0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
            },
          }
        )
        .catch((error) => {
          showConsole && console.log("Failed to log error:", error);
        });
    }
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
  MySwal,
}) {
  handleSetLoadingStatus("กำลังตรวจสอบข้อมูลสมาชิก", 274);

  // verify exist member
  userInfo && showConsole && console.log("%cuserInfo:", "color:lime", userInfo);
  if (userInfo && userInfo.member_citizenId) {
    autoAddMember(userInfo);
    handleSetLoadingStatus("ทำการเพิ่มข้อมูลสมากชิกใหม่สำเร็จ", 229);
    // return true;
  }
  if (userInfo && userInfo.citizenID) {
    handleSetLoadingStatus("กำลังรวบรวมสถิติลิงก์ของสมาชิก", 271);
    handleUpdateUserLinksCounter(userInfo.citizenID);

    autoUpdateMember(userInfo);
    handleSetLoadingStatus("ทำการอัพเดทข้อมูลสมากชิกสำเร็จ", 234);
    // return true;
  }

  return await onSignInProgress({
    userInfo: userInfo,
    handleSetLoadingStatus: handleSetLoadingStatus,
    setMemberInfo: setMemberInfo,
    MySwal: MySwal,
  }).then((result) => {
    showConsole && console.log("99OnSignInProgress Result:", result);
    return result;
  });
}

async function onSignInProgress({
  userInfo,
  handleSetLoadingStatus,
  setMemberInfo,
  MySwal,
}) {
  showConsole && console.log("userInfo:", userInfo);
  showConsole &&
    console.log(
      "citizenID:",
      userInfo.citizenID,
      "e_mail:",
      userInfo.e_mail,
      "firstNameEn:",
      userInfo.firstNameEn
    );
  const instance = axios.create({
    baseURL: "https://api.maejo.link/auth/",
    headers: {
      Citizenid: userInfo.citizenID,
      Email: userInfo.e_mail,
      FirstNameEn: userInfo.firstNameEn,
      Authorization: "Bearer 0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
    },
  });
  //   showConsole && console.log("axios config:", instance);

  return await instance
    .get()
    .then((res) => {
      showConsole && console.log("auth res:", res);
      if (res.data) {
        showConsole && console.log("auth res data:", res.data);
        handleSetLoadingStatus("กำลังโหลดข้อมูลลิงก์และสถิติ", 305);
        sessionStorage.setItem("memberToken", res.data);
        sessionStorage.setItem("memberEmail", userInfo.e_mail);
        //   setCookie("memberToken", res.data);
        return getMemberInfo({
          signToken: res.data,
          handleSetLoadingStatus: handleSetLoadingStatus,
          setMemberInfo: setMemberInfo,
        }).then((result) => {
          if (result.member?.member_citizenId) {
            showConsole && console.log("99getMemberInfo res:", result);
            return result;
          } else {
            showConsole && console.log("99getMemberInfo res:", "fail");
          }
        });
      } else {
        handleSetLoadingStatus("ไม่สามารถเข้าสู่ระบบได้ขณะนี้", 317);
        showConsole && console.log("283 error res:", res);
        sessionStorage.removeItem("memberToken");
        // *
        // alert("login fail please try again");
        MySwal.fire({
          title: "เกิดข้อผิดพลาด E05",
          text: "เกิดข้อผิดพลาดในการเรียกข้อมูลบุคลากร โปรดลองอีกครั้ง.",
          icon: "warning",
          confirmButtonText: " ลองอีกครั้ง ",
        }).then((result) => {
          if (result.isConfirmed) {
            showConsole && console.warn("141 login fail please try again");
            // window.location.replace("/");
            window.location.replace(
              `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=283`
            );
          }
        });
        return false;
      }
    })
    .catch((error) => {
      if (error.response) {
        showConsole && console.log("E-res:", error.response.data);
      } else if (error.request) {
        showConsole && console.log("E-req:", error.request);
      } else {
        showConsole && console.log("AxiosError:", error.message);
      }
      showConsole && console.log("E-config:", error.config);

      sessionStorage.removeItem("memberToken");
      handleSetLoadingStatus("เกิดข้อผิดพลาดในการเรียกข้อมูสมากชิก", 337);
      // window.location.replace(
      //   `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=283`
      // );
    });
}

export default function MjuSsoLogin() {
  //   const navigate = useNavigate();
  const MySwal = withReactContent(Swal);
  const [loadingStatus, setLoadingStatus] = useState("กำลังรวบรวมข้อมูล");
  const [isLoaded, setIsLoaded] = useState(false);

  const [userInfo, setUserInfo] = useState("");
  const [memberInfo, setMemberInfo] = useState();
  const [tryAgainLink, setTryAgainLink] = useState(false);
  // let tryAgainLink = false;
  const [tryAgainCountDown, setTryAgainCountDown] = useState(5);

  const { storeMember, signOut, randomString } = useAuth();

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
          message
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
      name: userInfo.name,
      titleName: userInfo.titleName,
      firstName: userInfo.firstName,
      lastName: userInfo.lastName,
      titleNameEn: userInfo.titleNameEn,
      firstNameEn: userInfo.firstNameEn,
      lastNameEn: userInfo.lastNameEn,
      position: userInfo.position,
      e_mail: userInfo.e_mail || userInfo.E_mail,
      personnelPhoto: userInfo.personnelPhoto
        ? encodeURIComponent(
            "https://personnel.mju.ac.th/photomju/" + userInfo.personnelPhoto
          )
        : encodeURIComponent("/user_default.png"),
      section: userInfo.section,
      division: userInfo.division,
      faculty:
        userInfo?.faculty ||
        userInfo?.section ||
        userInfo?.division ||
        "ไม่ระบุ",
    });

    const config = {
      method: "POST",
      baseURL: "https://api.maejo.link/user/",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer 0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
        Method: "autoAddMemberV2",
      },
      data: data,
    };
    showConsole && console.log("verify user is exist:", config);
    axios
      .request(config)
      .then((response) => {
        setLoadingStatus("โหลดข้อมูลสมาชิกสําเร็จ");
        showConsole &&
          console.log("res โหลดข้อมูลสมาชิกสำเร็จ:", response.data);
        // console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        console.log("line 493:", error);
      });
  };

  const autoUpdateMember = (userInfo) => {
    showConsole &&
      console.log("%cautoUpdateMember userInfo:", "color:red", userInfo);
    const data = JSON.stringify({
      member_citizenId: userInfo.citizenID,
      member_titleName: userInfo.titleName,
      member_firstName: userInfo.firstName,
      member_lastName: userInfo.lastName,
      member_titleNameEn: userInfo.titleNameEn,
      member_firstNameEn: userInfo.firstNameEn,
      member_lastNameEn: userInfo.lastNameEn,
      member_position: userInfo.position,
      member_email: userInfo.e_mail || userInfo.E_mail,
      member_adminPositionType: userInfo.division,
      member_faculty:
        userInfo?.faculty ||
        userInfo?.section ||
        userInfo?.division ||
        "ไม่ระบุ",
      member_personelPhoto: userInfo.personnelPhoto
        ? encodeURIComponent(
            "https://personnel.mju.ac.th/photomju/" + userInfo.personnelPhoto
          )
        : encodeURIComponent("/user_default.png"),
      section: userInfo.section,
      division: userInfo.division,
      member_token: dayjs().unix() + "-" + randomString(48),
    });
    showConsole && console.log("%cautoUpdateMember data:", "color:red", data);

    const config = {
      method: "PATCH",
      baseURL: "https://api.maejo.link/user/",
      headers: {
        "Content-Type": "application/json",
        Method: "MJUSSOUpdate",
        Authorization: "Bearer 0dd39219240c3b0db76989fdd4f0a242b2ca2fb0",
      },
      data: data,
    };
    showConsole && console.log("update user is exist:", JSON.parse(data));
    axios
      .request(config)
      .then((response) => {
        setLoadingStatus("อัพเดทข้อมูลสมาชิกสําเร็จ");
        showConsole &&
          console.log("res อัพเดทข้อมูลสมาชิกสําเร็จ:", response.data);
      })
      .catch((error) => {
        console.log("line 546:", error);
      });
  };

  useEffect(() => {
    if (!clientId || !code) {
      window.location.replace(
        `https://sso.mju.ac.th/signin.aspx?cid=${clientId}&line=352`
      );
    }

    showConsole &&
      clientId &&
      code &&
      console.log("cliendID:", clientId, " code:", code);
    clientId &&
      code &&
      fetchMjuSsoUserInfo({
        clientId: clientId,
        code: code,
        MySwal: Swal,
        handleSetLoadingStatus: handleSetLoadingStatus,
        setUserInfo: setUserInfo,
      }).then((res) => {
        if (!res) {
          setUserInfo(null);
          MySwal.fire({
            title: "ขออภัย E04",
            text: "สำหรับบุคลากรเท่านั้น.",
            icon: "warning",
            confirmButtonText: " รับทราบ ",
          }).then((result) => {
            if (result.isConfirmed) {
              showConsole && console.warn("224 you are student go logout");
              // window.location.replace("/");
              window.location.replace(
                `https://sso.mju.ac.th/signout.aspx?cid=${clientId}&line=226`
              );
            }
          });
        }
      });
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
        MySwal: Swal,
      }).then((result) => {
        if (result) {
          handleSetIsLoaded(true);
          showConsole && console.log("999 onSignIn result: ", result);
          //   showConsole && console.log("ready");
          //   showConsole && console.log("isLoaded:", isLoaded);
          GotJwt({
            userInfo: result,
            handleSetLoadingStatus: handleSetLoadingStatus,
            storeMember: storeMember,
            MySwal: Swal,
            signOut: signOut,
          }).then((result) => {
            handleSetIsLoaded(true);
            if (result && !isDebug) window.location.replace(`main`);
          });
        }
      });

    //   isLoaded && window.location.replace(`main`);
  }, [userInfo, isLoaded]);

  return (
    <div className="w-full max-w-sm mx-auto h-screen flex flex-col justify-center -mt-20 text-center">
      <p className="text-4xl font-extrabold tracking-widest text-white mb-8 text-shadow-lg">
        MAEJO.LINK
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
          className="text-blue-500 hover:underline"
        >
          คลิกปุ่ม Allow มุมบนซ้ายเพื่อใช้ระบบ หรือโปรดลองอีกครั้ง
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
              signOut();
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
