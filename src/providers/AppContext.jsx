import { createContext, useContext } from "react";

const AppContext = createContext("");
import packageJson from "../../package.json";

export const AppProvider = ({ children }) => {
    const appVersion = packageJson.version;
    const appLastupdate = packageJson.lastupdate;
    const appTitle = import.meta.env.VITE_APP_TITLE || "Authention";


    return (<AppContext.Provider value={{ appVersion, appLastupdate, appTitle }}>
        {children}
    </AppContext.Provider>);
};

export const UseApp = () => {
    const context = useContext(AppContext);
    if (context === undefined) {
        throw new Error("UseApp must be used within an AppProvider");
    }
    return context;
}
