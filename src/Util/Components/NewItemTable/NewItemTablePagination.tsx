import React, {ReactNode, useCallback, useMemo} from "react";
import {TablePagination} from "@material-ui/core";

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
        setRowsPerPage(+event.target.value);
        setPage(0);
    }, [setRowsPerPage, setPage]);
    let sliced = useMemo(()=>{
        return items.slice(page * rowsPerPage, (page + 1) * rowsPerPage)
    }, [page, rowsPerPage, items])
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
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
        }
    }
}