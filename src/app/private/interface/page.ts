import { Socio } from "../model/socio"


export interface Page {
    content: Socio[],
    pageable: {
        sort: {
            empty: boolean,
            unsorted: boolean,
            sorted: false
        },
        offset: number,
        pageSize: number,
        pageNumber: number,
        paged: boolean,
        unpaged: boolean
    },
    last: boolean,
    totalPages: number,
    totalElements: number,
    size: number,
    number: number,
    sort: {
        empty: boolean,
        unsorted: boolean,
        sorted: boolean
    },
    first: boolean,
    numberOfElements: number,
    empty: boolean

}