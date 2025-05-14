export enum ErrorCodes {
    //Not found
    NOT_FOUND = 400,

    //Bad request exceptions
    ENTITY_NOT_FOUND = 1000,
    OPERATION_NOT_ALLOWED = 1001,

    //Validation exception
    INTERNAL_ERROR = 500,
    VALIDATION_ERROR = 2000,
}
