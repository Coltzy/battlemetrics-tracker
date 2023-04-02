export interface BMErrors {
    errors: BMError[]
}

interface BMError {
    status?: string;
    title: string;
    detail: string;
}