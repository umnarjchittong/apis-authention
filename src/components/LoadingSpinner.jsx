import { useEffect } from "react";
import { Bars } from "react-loader-spinner";

const showConsole =
    import.meta.env.VITE_APP_SHOW_CONSOLE === "true" ? true : false;
const themeColor = import.meta.env.VITE_APP_THEME_COLOR || "#10B981";

export default function LoadingSpinner({ dataLoading, page, debug, children }) {
    // const dataLoading = props.dataLoading;
    //   const { dataLoading, page, debug } = props;
    useEffect(() => {
        showConsole &&
            dataLoading &&
            console.log("spinner-dataloading:", dataLoading);
        showConsole && page && console.log("spinner-page:", page);
        showConsole && debug && console.log("spinner-debug:", debug);
    }, [dataLoading, page, debug]);
    return (
        <div className="loadingSpinner text-center flex flex-col justify-center items-center w-full gap-y-4 md:gap-y-8">
            <Bars
                height="80"
                width="80"
                color={themeColor}
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={dataLoading}
            />
            <p className="text-base md:text-lg text-gray-800">{children}</p>
        </div>
    );
}

export function LoadingSpinnerWhite({ dataLoading, page, debug, children }) {
    // const dataLoading = props.dataLoading;
    //   const { dataLoading, page, debug, child } = props;
    useEffect(() => {
        showConsole &&
            dataLoading &&
            console.log("spinner-dataloading:", dataLoading);
        showConsole && page && console.log("spinner-page:", page);
        showConsole && debug && console.log("spinner-debug:", debug);
    }, [dataLoading, page, debug]);
    return (
        <div className="loadingSpinner flex flex-col gap-y-4 items-center justify-center my-5">
            <Bars
                height="80"
                width="80"
                color="#EEEEEE"
                ariaLabel="bars-loading"
                wrapperStyle={{}}
                wrapperClass=""
                visible={dataLoading}
            />
            <p className="text-sm text-white/90">{children}</p>
        </div>
    );
}
