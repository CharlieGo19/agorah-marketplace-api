// Agorah Service DB fields.
export const AGORAH_CURRENT_NFT_LISTING_PRICE = "list_nft_price";
export const HBAR_USD_PRICE = "hbar_usd_price";
export const HBAR_USD_PRICE_PREVIOUS = "hbar_usd_price_previous";

// DB Related Errors
export const PRIMSA_UNACCOUNTED_FOR_ERROR = "unknown error while inserting into";
export const PRISMA_CLIENT_CRASH =
	"prisma has exited with non-zero exit code, please restart process";
export const PRISMA_DATABASE_CONNECTION_NOT_ESTABLISHED =
	"error establishing connection to postgres database";
export const PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY = "malformed payload provided for query";
export const PRISMA_CREATE_FAILURE_TOKEN_EXISTS =
	"prisma failed to insert data in to collections table, token already exists";
export const PRISMA_FIND_FIRST_OR_THROW = "nft requested does not exist";

// Prisma Error Codes
export const PRISMA_UNOFFICIAL_ERROR_CODE_UNKNOWN = "P0000";
export const PRISMA_UNOFFICIAL_ERROR_CODE_VALIDATION_ERROR = "P0001";
export const PRISMA_ERROR_CODE_P2002 = "P2002";
export const PRISMA_ERROR_CODE_P2025 = "P2025";
export const PRISMA_ERROR_CODE_P2033 = "P2033";

// Axios Request Errors (Mirror Node)
export const AXIOS_400_MIRROR_NODE_REQUEST = "invalid token provided";
export const AXIOS_404_MIRROR_NODE_REQUEST = "token data could not be found";
export const AXIOS_DEFAULT_MIRROR_NODE_ERROR = "something went wrong requesting data for token";

// Mirror Node Errors (Non-axios)
export const MIRROR_NODE_REQUEST_UNCAUGHT_ERROR = "internal error, non axios related.";

// Axios Request Errors (IPFS)
export const AXIOS_400_IPFS_REQUEST = "could not resolve metadata from ipfs";
export const AXIOS_404_IPFS_REQUEST = "could not find metadata on ipfs";
export const AXIOS_DEFAULT_IPFS_ERROR = "something went wrong requesting data from ipfs";

// Metadata Errors
export const METADATA_NO_PARSABLE_IMAGE =
	"could not understand metadata associated with request, please @AGORAH staff with metadata link";

// Agorah Error Codes
//Notes: A - Agorah, Digit One - Series, i.e. 1xx is input Digit Two, Three and Four - Error Serie.
export const AGORAH_ERROR_CODE_A0000 = "A0000";
export const AGORAH_ERROR_CODE_A1001 = "A1001";
export const AGORAH_ERROR_CODE_A1002 = "A1002";
export const AGORAH_ERROR_CODE_A1003 = "A1003";
export const AGORAH_ERROR_CODE_A1004 = "A1004";
export const AGORAH_ERROR_CODE_A1005 = "A1005";
export const AGORAH_ERROR_CODE_A1006 = "A1006";
export const AGORAH_ERROR_CODE_A1007 = "A1007";
export const AGORAH_ERROR_CODE_A1008 = "A1008";
export const AGORAH_ERROR_CODE_A1009 = "A1009";
export const AGORAH_ERROR_CODE_A1010 = "A1010";
export const AGORAH_ERROR_CODE_A1011 = "A1011";
export const AGORAH_ERROR_CODE_A1012 = "A1012";
export const AGORAH_ERROR_CODE_A1013 = "A1013";
export const AGORAH_ERROR_CODE_A1014 = "A1014";
export const AGORAH_ERROR_CODE_A1015 = "A1015";
export const AGORAH_ERROR_CODE_A1016 = "A1016";
export const AGORAH_ERROR_CODE_A1017 = "A1017";
export const AGORAH_ERROR_CODE_A1018 = "A1018";
export const AGORAH_ERROR_CODE_A1019 = "A1019";
export const AGORAH_ERROR_CODE_A1020 = "A1020";
export const AGORAH_ERROR_CODE_A1021 = "A1021";

// Agorah Error Messages
export const AGORAH_ERROR_MESSAGE_A0000 = "unexpected error, please contact @AGORAH";
export const AGORAH_ERROR_MESSAGE_A1001 = "invalid token id provided";
export const AGORAH_ERROR_MESSAGE_A1002 = "range either too big or exceeds series";
export const AGORAH_ERROR_MESSAGE_A1003 = "invalid series range";
export const AGORAH_ERROR_MESSAGE_A1004 = "invalid account id provided";
export const AGORAH_ERROR_MESSAGE_A1005 = "transaction expired";
export const AGORAH_ERROR_MESSAGE_A1006 = "transaction id does not have a valid account id";
export const AGORAH_ERROR_MESSAGE_A1007 = "transaction id does not match payer account id";
export const AGORAH_ERROR_MESSAGE_A1008 = "invalid pricing data";
export const AGORAH_ERROR_MESSAGE_A1009 = "pricing data not set";
export const AGORAH_ERROR_MESSAGE_A1010 = "transaction did not include a valid agorah vault";
export const AGORAH_ERROR_MESSAGE_A1011 = "nftsender does not match the transaction payer";
export const AGORAH_ERROR_MESSAGE_A1012 = "nft token transaction data incomplete";
export const AGORAH_ERROR_MESSAGE_A1013 = "couldn't set listing price";
export const AGORAH_ERROR_MESSAGE_A1014 = "hbar sender does not match the transaction payer";
export const AGORAH_ERROR_MESSAGE_A1015 = "hbar reciever is not a valid agorah vault";
export const AGORAH_ERROR_MESSAGE_A1016 = "not enough hbars to cover the nft listing price";
export const AGORAH_ERROR_MESSAGE_A1017 = "hbar sent and recieved do not match";
export const AGORAH_ERROR_MESSAGE_A1018 = "not valid transaction bytes";
export const AGORAH_ERROR_MESSAGE_A1019 = "not valid number hbar transfers";
export const AGORAH_ERROR_MESSAGE_A1020 = "more than one nft transfer in transaction";
export const AGORAH_ERROR_MESSAGE_A1021 = "invalid transaction id";

// API Response Messages
export const RESPONSE_BAD_PARAM_REFUSED = "BAD INPUT, SERVER REFUSED TO PROCESS";
export const RESPONSE_TOKEN_NOT_FOUND = "TOKEN REQUEST FAILED, TOKEN DOES NOT EXIST";
export const RESPONSE_MESSY_METADATA =
	"DATA DOES NOT CONTAIN VALID INFORMATION, SERVER REFUSED TO PROCESS";
export const RESPONSE_MIRROR_NODE_SERVICE_DOWN =
	"INTERNAL ERROR, MIRROR NODE SERVICE DID NOT PROVIDE VALID RESPONSE";
export const RESPONSE_IPFS_SERVICE_DOWN =
	"INTERNAL ERROR, IPFS SERVICE DID NOT PROVIDE VALID RESPONSE";
export const RESPONSE_UNEXPECTED_ERROR = "UNKNOWN SERVER ERROR, PLEASE @ AGORAH STAFF";

// Misc
export const AGORAH_ERROR_PLACEHOLDER_IMAGE = "https://agorah.io";
