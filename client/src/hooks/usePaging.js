import React, { useMemo } from 'react';
import { useHistory } from 'react-router';
import useQuery from './useQuery';

function usePaging(key) {
    const query = useQuery();
    const history = useHistory();

    const page = query.get(key) ? +query.get(key) : 1;

    function changeCurrentPage(nextPage) {
        history.push({
            search: `?${key}=${nextPage}`
        })
    }

    return [ page, changeCurrentPage ];
}

export default usePaging;