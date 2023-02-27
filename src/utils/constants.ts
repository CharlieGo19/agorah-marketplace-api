// DB Related Errors
export const PRIMSA_UNACCOUNTED_FOR_ERROR = "unknown error while inserting into";
export const PRISMA_CLIENT_CRASH =
	"prisma has exited with non-zero exit code, please restart process";
export const PRISMA_DATABASE_CONNECTION_NOT_ESTABLISHED =
	"error establishing connection to postgres database";
export const PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY = "malformed payload provided for query";
export const PRISMA_CREATE_FAILURE_TOKEN_EXISTS =
	"prisma failed to insert data in to collections table, token already exists";

// Prisma Error Codes
export const PRISMA_ERROR_CODE_UNKNOWN = "P0000";
export const PRISMA_ERROR_CODE_P2002 = "P2002";
export const PRISMA_ERROR_CODE_P2025 = "P2025";
export const PRISMA_ERROR_CODE_P2033 = "P2033";

// Axios Request Errors (Mirror Node)
export const AXIOS_400_MIRROR_NODE_REQUEST = "invalid token provided";
export const AXIOS_404_MIRROR_NODE_REQUEST = "token data could not be found";
export const AXIOS_DEFAULT_MIRROR_NODE_ERROR = "something went wrong requesting data for token";

// Mirror Node Errors (Non-axios)
export const MIRROR_NODE_REQUEST_UNCAUGHT_ERROR = "internal error, non axios related.";

// API Response Messages
export const RESPONSE_BAD_PARAM_REFUSED = "BAD INPUT, SERVER REFUSED TO PROCESS";
export const RESPONSE_TOKEN_NOT_FOUND = "TOKEN REQUEST FAILED, TOKEN DOES NOT EXIST";
export const RESPONSE_MIRROR_NODE_SERVICE_DOWN =
	"INTERNAL ERROR, MIRROR NODE SERVICE DID NOT PROVIDE VALID RESPONSE";
export const RESPONSE_UNEXPECTED_ERROR = "UNKNOWN SERVER ERROR, PLEASE @ AGORAH STAFF";
