import { createContext, useContext, useEffect, useState } from "react";
import { Key, FileText, Code, LifeBuoy, HousePlus } from "lucide-react";

const AppContext = createContext("");
import packageJson from "../../package.json";
const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;

export const AppProvider = ({ children }) => {
    const appVersion = packageJson.version;
    const appLastupdate = packageJson.lastupdate;
    const appTitle = import.meta.env.VITE_APP_TITLE || "Authention";
    const [activePage, setActivePage_] = useState(localStorage.getItem("activePage") || "home");

    const navItems = [
        { icon: HousePlus, label: "Home", id: "home", authenticated: false },
        { icon: Key, label: "Tokens", id: "tokens", authenticated: true },
        { icon: FileText, label: "Documentation", id: "documentation", authenticated: false },
        { icon: Code, label: "API Reference", id: "api-reference", authenticated: false },
        { icon: LifeBuoy, label: "Support", id: "support", authenticated: false },
    ];

    const setActivePage = (pageId) => {
        setActivePage_(pageId);
        localStorage.setItem("activePage", pageId);
        console.log("Active page changed:", pageId);
    }

    return (
        <AppContext.Provider
            value={{ appVersion, appLastupdate, appTitle, navItems, activePage, setActivePage, showConsole }}
        >
            {children}
        </AppContext.Provider>
    );
};

export const UseApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("UseApp must be used within an AppProvider");
    }
    return context;
};
