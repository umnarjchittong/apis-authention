import { createContext, useContext } from "react";
import {  Key, FileText, Code, LifeBuoy } from 'lucide-react';

const AppContext = createContext("");
import packageJson from "../../package.json";

export const AppProvider = ({ children }) => {
    const appVersion = packageJson.version;
    const appLastupdate = packageJson.lastupdate;
    const appTitle = import.meta.env.VITE_APP_TITLE || "Authention";

    const navItems = [
  { icon: Key, label: 'Tokens', id: 'tokens' },
  { icon: FileText, label: 'Documentation', id: 'documentation' },
  { icon: Code, label: 'API Reference', id: 'api-reference' },
  { icon: LifeBuoy, label: 'Support', id: 'support' },
];


    return (<AppContext.Provider value={{ appVersion, appLastupdate, appTitle, navItems }}>
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
