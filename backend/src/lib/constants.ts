export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  INTERNAL_SERVER_ERROR: 500,
}

export const HTTP_STATUS_MESSAGES = {
  OK: 'OK',
  CREATED: 'Created',
  NO_CONTENT: 'No Content',
  BAD_REQUEST: 'Bad Request',
  UNAUTHORIZED: 'Unauthorized',
  FORBIDDEN: 'Forbidden',
  NOT_FOUND: 'Not Found',
  CONFLICT: 'Conflict',
  INTERNAL_SERVER_ERROR: 'Internal Server Error',
}

export const INVALID_PASSWORD_MESSAGE = 'Password must be at least 8 characters long and include at least one letter and one number.';



/*********************** SCHEMA NAMES *********************/

export const USER_SCHEMA_NAME = "users"
export const NOTE_BOOK_SCHEMA_NAME = "note-books"
export const NOTES_SCHEMA_NAME = "notes"
export const WORKSPACE_SCHEMA_NAME = "work-spaces"