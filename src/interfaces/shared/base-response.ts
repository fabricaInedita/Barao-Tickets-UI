export interface IBaseResponse<T> {
    errors: any
    success: boolean
    pageSize: number
    page:number
    totalRecords:number
    data: T
}