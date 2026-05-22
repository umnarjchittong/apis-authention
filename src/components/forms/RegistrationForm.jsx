import { Zap, ShieldCheck } from "lucide-react";
import { motion } from "motion/react";
import { UseAuth } from "../../providers/AuthContext";
import { useNavigate } from "react-router";
import Swal from "sweetalert2";
import { useEffect } from "react";
import axios from "axios";

// import apiEndpoints from "../../assets/JSON/api_endpoint.json";

export default function RegistrationForm({ onGenerate }) {
    const {
        memberInfo,
        generateToken,
        apiTokenAdmin,
        tokenCreatedClear,
        apiEndpoints,
    } = UseAuth();
    const formData = new FormData();
    const navigate = useNavigate();

    // const handleProjectNameChange = (e) => {
    //     e.preventDefault();
    //     formData.set("site_name", e.target.value);
    //     console.log("Project Name:", formData.get("site_name"));
    // };

    // const handleProjectURLChange = (e) => {
    //     e.preventDefault();
    //     formData.set("site_url", e.target.value);
    //     console.log("Project URL:", formData.get("site_url"));
    // };

    const handleTokenLvChange = (e) => {
        e.preventDefault();
        tokenCreatedClear();
        formData.set("site_token_lv", e.target.value);
        console.log("Token Level:", formData.get("site_token_lv"));
    };

    const handleApiEndpointChange = (e) => {
        e.preventDefault();
        tokenCreatedClear();
        formData.set("api_id", e.target.value);
        console.log("API Endpoint:", formData.get("api_id"));
    };

    const formReset = () => {
        formData.delete("site_name");
        formData.delete("site_url");
        formData.delete("site_token_lv");
        formData.delete("api_id");
        document.getElementById("site_name").value = "";
        document.getElementById("site_url").value = "";
        document.getElementById("site_token_lv").value = "guest";
        document.getElementById("api_id").value = "";
    };

    const handleGenerateToken = () => {
        if (memberInfo?.authLv >= 3) {
            console.log("Generating token with data:", {
                site_name: formData.get("site_name"),
                site_url: formData.get("site_url"),
                site_token_lv: formData.get("site_token_lv"),
                api_id: formData.get("api_id"),
            });
            // if (formData.get("site_name")?.trim() === "")
            //     formData.set(
            //         "site_name",
            //         document.getElementById("site_name").value,
            //     );
            // if (formData.get("site_url")?.trim() === "")
            //     formData.set(
            //         "site_url",
            //         document.getElementById("site_url").value,
            //     );
            // if (formData.get("site_token_lv")?.trim() === "")
            //     formData.set(
            //         "site_token_lv",
            //         document.getElementById("site_token_lv").value,
            //     );
            const token = generateToken(
                formData.get("site_token_lv")?.toLocaleLowerCase(),
            );
            const endpoint = apiEndpoints.filter(
                (endpoint) =>
                    endpoint.api_id === parseInt(formData.get("api_id")),
            )[0];
            console.log("Selected API Endpoint:", endpoint);
            const body = {
                site_name: formData.get("site_name"),
                site_url: formData.get("site_url") || "",
                site_token: token,
                site_token_lv:
                    formData.get("site_token_lv")?.toLocaleLowerCase() ||
                    "guest",
                user_id: memberInfo?.userID,
                user_citizenID: memberInfo?.citizenID.toString(),
                api_endpoint: endpoint?.api_endpoint || "",
                api_url: endpoint?.api_url || "",
                api_id: parseInt(formData.get("api_id")),
            };

            // console.log("Request body for token generation:", body);
            // return;
            const config = {
                method: "post",
                url: "https://apis.mju.ac.th/authention/v1/sites",
                headers: {
                    Authorization: "Bearer " + apiTokenAdmin,
                    "Content-Type": "application/json",
                },
                data: JSON.stringify(body),
            };

            axios(config)
                .then(function (response) {
                    console.log("API Response:", response.data, JSON.stringify(response.data));
                    formReset();
                    onGenerate();
                    return response.data.data;
                })
                .catch(function (error) {
                    console.log(error);
                    tokenCreatedClear();
                });
        }
    };

    return (
        <section
            onClick={(e) => {
                if (!memberInfo) {
                    e.preventDefault();
                    // alert("Please log in to generate a token.");
                    // window.location.replace("./login");
                    // navigate("/login");
                    Swal.fire({
                        title: "โปรดเข้าระบบด้วย MJUSSO",
                        text: "คุณต้องเข้าระบบก่อนใช้งาน",
                        icon: "info",
                        confirmButtonText: "ไปยังหน้าล็อกอิน",
                    }).then((result) => {
                        if (result.isConfirmed) {
                            // window.location.replace("./login");
                            navigate("./login");
                        }
                    });
                }
            }}
            className="lg:col-span-2 glass-panel p-margin rounded-xl shadow-2xl relative overflow-hidden"
        >
            <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-primary via-tertiary to-primary opacity-50"></div>

            <form className="space-y-gutter">
                <div className="group">
                    <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
                        Project Name
                    </label>
                    <div className="relative">
                        <input
                            id="site_name"
                            type="text"
                            placeholder="e.g., My Awesome Project"
                            required
                            disabled={!memberInfo}
                            readOnly={!memberInfo}
                            // onChange={handleProjectNameChange}
                            defaultValue={formData.get("site_name") || ""}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-mono text-sm"
                        />
                    </div>
                </div>

                <div className="group">
                    <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
                        Project URL
                    </label>
                    <div className="relative">
                        <input
                            id="site_url"
                            type="url"
                            placeholder="e.g., https://example.com"
                            required
                            disabled={!memberInfo}
                            readOnly={!memberInfo}
                            // onChange={handleProjectURLChange}
                            defaultValue={formData.get("site_url") || ""}
                            className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-mono text-sm"
                        />
                    </div>
                </div>

                {/* <div className="group">
          <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
            Token
          </label>
          <div className="relative">
            <input 
              type="url"
              placeholder=""
              className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder:text-outline/50 font-mono text-sm"
            />
          </div>
        </div> */}

                <div className="group">
                    <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
                        Token Level
                    </label>
                    <select
                        id="site_token_lv"
                        disabled={!memberInfo}
                        readOnly={!memberInfo}
                        onChange={handleTokenLvChange}
                        defaultValue={formData.get("site_token_lv") || "guest"}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none font-mono text-sm"
                    >
                        <option value="guest">
                            Read-only (Guest - requires authLv 3+)
                        </option>
                        <option value="application">
                            Read/Write (Application - requires authLv 5+)
                        </option>
                        <option value="admin" disabled={memberInfo?.authLv < 7}>
                            Full Admin (Admin - requires authLv 7+)
                        </option>
                    </select>
                </div>

                <div className="group">
                    <label className="block text-[12px] font-mono font-semibold uppercase tracking-wider text-on-surface-variant mb-2 group-focus-within:text-primary transition-colors">
                        API Endpoint
                    </label>
                    <select
                        id="api_id"
                        disabled={!memberInfo}
                        readOnly={!memberInfo}
                        onChange={handleApiEndpointChange}
                        defaultValue={formData.get("api_id") || ""}
                        className="w-full bg-surface-container-lowest border border-outline-variant rounded-lg px-4 py-3 text-on-surface focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all appearance-none font-mono text-sm"
                    >
                        <option value="" disabled>
                            โปรดเลือก API Endpoint ที่ต้องการเข้าถึง
                        </option>
                        {apiEndpoints?.map((endpoint, idx) => (
                            <option key={idx} value={endpoint.api_id}>
                                {endpoint.api_endpoint} ({endpoint.api_url})
                            </option>
                        ))}
                        {/* {apiEndpoints?.map((endpoint, idx) => (
                        <option key={idx} value={endpoint.api_endpoint}>
                            {endpoint.api_endpoint} ({endpoint.api_url})
                        </option>
                      ))} */}
                    </select>
                </div>

                <div className="pt-base">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={(e) => {
                            e.preventDefault();
                            if (
                                document
                                    .getElementById("site_name")
                                    .value.trim() !== "" &&
                                document
                                    .getElementById("site_url")
                                    .value.trim() !== ""
                            ) {
                                formData.set(
                                    "site_name",
                                    document.getElementById("site_name").value,
                                );
                                formData.set(
                                    "site_url",
                                    document.getElementById("site_url").value,
                                );
                                formData.set(
                                    "site_token_lv",
                                    document.getElementById("site_token_lv")
                                        .value,
                                );
                                formData.set(
                                    "api_id",
                                    document.getElementById("api_id").value,
                                );
                                handleGenerateToken();
                            }
                        }}
                        className="w-full bg-primary-container text-on-primary-container font-bold py-4 rounded-lg flex items-center justify-center gap-base neon-glow-primary transition-all cursor-pointer"
                    >
                        <Zap className="w-5 h-5 fill-current" />
                        Generate Token
                    </motion.button>
                </div>

                <footer className="pt-margin border-t border-outline-variant/20">
                    <div className="flex items-start gap-base text-on-surface-variant">
                        <ShieldCheck className="w-5 h-5 text-tertiary shrink-0" />
                        <p className="text-[12px] leading-relaxed">
                            <span className="font-bold text-on-surface">
                                ความปลอดภัย:
                            </span>{" "}
                            โปรดตรวจสอบให้แน่ใจว่าโทเค็นของคุณถูกจัดเก็บไว้ในสภาพแวดล้อมฝั่งเซิร์ฟเวอร์ที่ปลอดภัย.
                        </p>
                    </div>
                </footer>
            </form>
        </section>
    );
}
