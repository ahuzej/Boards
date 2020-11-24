import { useEffect, useRef, useState } from "react";
import { useDispatch } from "react-redux";
import { logoutAction } from "../actions/authActions";

function useRequest(callback, deps) {
    const dispatch = useDispatch();
    const [error, setError] = useState(false);
    const [loading, setLoading] = useState(true);
    const [forceReload, setForceReload] = useState(false); // toggling between true/false to trigger useEffect via dep array
    const lastReqTime = useRef(null); // prevent multiple requests in a short time interval

    useEffect(() => {
        async function sendRequest() {
            if (((Date.now() - lastReqTime.current) / 1000) > 3 || !lastReqTime) {
                try {
                    lastReqTime.current = Date.now();
                    await callback();
                    setLoading(false);
                } catch (err) {
                    setError(true);
                    if (err.response) {
                        const { statusCode } = err.response.data;
                        switch (statusCode) {
                            case -100:
                                dispatch(logoutAction());
                                break;
                            default:
                                break;
                        }
                    } else if (err.request) {

                    } else {

                    }
                }
            }
        }
        sendRequest();
    }, [...deps, forceReload]);

    function forceReloadFn() {
        setForceReload(!forceReload);
    }

    return [loading, error, forceReloadFn];

}

export default useRequest;