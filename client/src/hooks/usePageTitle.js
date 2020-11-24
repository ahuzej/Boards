import { useRef, useEffect } from "react";
import { appName } from "../ui/uiSettings";

function usePageTitle(title) {
    const pageTitle = useRef(title);

    /**
     * After every render, change the page title only if title has changed. 
     */
    useEffect(() => {
        document.title = `${pageTitle.current} - ${appName}`;
    }, [title])

    return pageTitle;
}

export default usePageTitle;