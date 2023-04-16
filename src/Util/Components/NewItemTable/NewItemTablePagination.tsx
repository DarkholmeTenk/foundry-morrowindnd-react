import React, {ReactNode, useCallback, useMemo} from "react";
import {TablePagination} from "@mui/material";

interface UsePaginationProps<T> {
    items: T[]
}
interface UsePaginationResult<T> {
    sliced: T[],
    PaginationComponent: ReactNode | null
}
export function usePagination<T>({items}: UsePaginationProps<T>): UsePaginationResult<T> {
    let [page, setPage] = React.useState(0);
    let [rowsPerPage, setRowsPerPage] = React.useState(20);
    let handleChangePage = useCallback((e,p)=>setPage(p), [setPage])
    const handleChangeRowsPerPage = useCallback((event) => {
        setRowsPerPage(+event.target.valueAsNumber);
        setPage(0);
    }, [setRowsPerPage, setPage]);
    let maxPages = Math.ceil(items.length / rowsPerPage)
    let realPage = Math.min(maxPages - 1, Math.max(page, 0))
    let sliced = useMemo(()=>{
        return items.slice(realPage * rowsPerPage, (realPage + 1) * rowsPerPage)
    }, [realPage, rowsPerPage, items])
    if(items.length <= 1) {
        return {
            sliced,
            PaginationComponent: null
        }
    } else {
        return {
            sliced,
            PaginationComponent: <TablePagination
                rowsPerPageOptions={[10, 20, 40, 100]}
                count={items.length}
                component="div"
                rowsPerPage={rowsPerPage}
                page={realPage}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        }
    }
}