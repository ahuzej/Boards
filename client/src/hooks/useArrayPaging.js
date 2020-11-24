import { useMemo, useState, useCallback, useEffect } from 'react';

export default (values, itemsPerPage, page) => {

    const [allValues, setAllValues] = useState(values);
    const [pagedValues, setPagedValues] = useState([]);
    const totalPageNumber = useMemo(() => Array.isArray(values) ? Math.ceil(values.length / itemsPerPage) : 0, [values, itemsPerPage]);

    /*
        itemsPerPage - 3
        pageNum:1 idxStart:0 idxEnd:2
        pageNum:2 idxStart:3 idxEnd:5
        pageNum:3 idxStart:6 idxEnd:8
    */
    const changePage = useCallback((pageNum) => {
        if (Array.isArray(allValues) && allValues.length > 0) {
            let idxEnd = itemsPerPage * pageNum - 1;
            console.log('itemsPerPage %s page %s', itemsPerPage, pageNum);
            if (idxEnd >= allValues.length) idxEnd = allValues.length;
            let idxStart = (pageNum - 1) * itemsPerPage;
            if (idxStart < 0) idxStart = 0;
            console.log("idxStart %s idxEnd %s", idxStart, idxEnd);
            let sliced = [...allValues].slice(idxStart, idxEnd + 1); // end is not included...
            setPagedValues(sliced);
        }
    }, [allValues, itemsPerPage]);

    /**
     * Rescope array paging whenever current page changes
     */
    useEffect(() => {
        changePage(page);
    }, [changePage, page]);

    useEffect(() => {
        setAllValues(values);
    }, [values]);

    return [pagedValues, totalPageNumber];
}