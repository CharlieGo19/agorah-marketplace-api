import { collections, Prisma } from "@prisma/client";
import axios, { AxiosError } from "axios";
import { Request, Response, NextFunction } from "express";
import { env } from "..";
import { GetCollectionInformationFromMirror } from "../controllers/collection.controller";
import {
	AXIOS_400_MIRROR_NODE_REQUEST,
	AXIOS_404_MIRROR_NODE_REQUEST,
	AXIOS_DEFAULT_MIRROR_NODE_ERROR,
	MIRROR_NODE_REQUEST_UNCAUGHT_ERROR,
	PRIMSA_UNACCOUNTED_FOR_ERROR,
	PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY,
	PRISMA_CLIENT_CRASH,
	PRISMA_CREATE_FAILURE_TOKEN_EXISTS,
	PRISMA_DATABASE_CONNECTION_NOT_ESTABLISHED,
	PRISMA_ERROR_CODE_P2002,
	PRISMA_ERROR_CODE_P2025,
	PRISMA_ERROR_CODE_P2033,
	PRISMA_UNOFFICIAL_ERROR_CODE_UNKNOWN,
	RESPONSE_TOKEN_NOT_FOUND,
	RESPONSE_BAD_PARAM_REFUSED,
	RESPONSE_UNEXPECTED_ERROR,
	RESPONSE_MIRROR_NODE_SERVICE_DOWN,
	AGORAH_ERROR_CODE_A1001,
	AGORAH_ERROR_MESSAGE_A1001,
	AGORAH_ERROR_CODE_A1002,
	AGORAH_ERROR_MESSAGE_A1002,
	AGORAH_ERROR_MESSAGE_A0000,
	AGORAH_ERROR_MESSAGE_A1003,
	AGORAH_ERROR_CODE_A1003,
	AXIOS_400_IPFS_REQUEST,
	AXIOS_404_IPFS_REQUEST,
	AXIOS_DEFAULT_IPFS_ERROR,
	RESPONSE_IPFS_SERVICE_DOWN,
	METADATA_NO_PARSABLE_IMAGE,
	PRISMA_UNOFFICIAL_ERROR_CODE_VALIDATION_ERROR,
	RESPONSE_MESSY_METADATA,
	AGORAH_ERROR_CODE_A1004,
	AGORAH_ERROR_MESSAGE_A1004,
	AGORAH_ERROR_CODE_A1005,
	AGORAH_ERROR_CODE_A1006,
	AGORAH_ERROR_CODE_A1007,
	AGORAH_ERROR_CODE_A1008,
	AGORAH_ERROR_CODE_A1009,
	AGORAH_ERROR_CODE_A1010,
	AGORAH_ERROR_CODE_A1011,
	AGORAH_ERROR_CODE_A1012,
	AGORAH_ERROR_CODE_A1013,
	AGORAH_ERROR_CODE_A1014,
	AGORAH_ERROR_CODE_A1015,
	AGORAH_ERROR_CODE_A1016,
	AGORAH_ERROR_CODE_A1017,
	AGORAH_ERROR_CODE_A1018,
	AGORAH_ERROR_CODE_A1019,
	AGORAH_ERROR_CODE_A1020,
	AGORAH_ERROR_CODE_A1021,
} from "./constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(
	err: Error | AxiosError,
	_req: Request,
	res: Response,
	_next: NextFunction
) {
	if (err instanceof PrismaError) {
		console.log("%s: PRISMA ERROR - %s, %s.", new Date().toUTCString(), err.code, err.message);
		switch (err.code) {
			case PRISMA_ERROR_CODE_P2033:
				res.status(400).json({
					status: 400,
					error: RESPONSE_BAD_PARAM_REFUSED,
				});
				break;
			case PRISMA_ERROR_CODE_P2025:
				res.status(400).json({
					status: 400,
					error: RESPONSE_TOKEN_NOT_FOUND,
				});
				break;
			case PRISMA_UNOFFICIAL_ERROR_CODE_VALIDATION_ERROR:
				res.status(400).json({
					status: 400,
					error: RESPONSE_MESSY_METADATA,
				});
				break;
			case PRISMA_UNOFFICIAL_ERROR_CODE_UNKNOWN:
			default:
				res.status(400).json({
					status: 400,
					RESPONSE_UNEXPECTED_ERROR,
				});
				break;
			// TODO: FINISH THESE. DO UNOFFICIAL_ERROR UKNOWN
		}
	} else if (err instanceof MirrorNodeError) {
		switch (err.code) {
			case 400:
			case 404:
				WriteUserInputTrace("MIRROR NODE ERROR", err);
				res.status(404).json({
					status: 404,
					error: RESPONSE_TOKEN_NOT_FOUND,
				});
				break;
			case 0:
				console.log(
					"%s: MIRROR NODE ERROR - %s, %s",
					new Date().toUTCString(),
					err.code,
					err.message
				);
				res.status(503).json({
					status: 503,
					error: RESPONSE_MIRROR_NODE_SERVICE_DOWN,
				});
				break;
		}
	} else if (err instanceof IpfsError) {
		switch (err.code) {
			case 0:
				WriteIpfsTrace("IPFS ERROR", err);
				res.status(501).json({
					status: 501,
					error: METADATA_NO_PARSABLE_IMAGE,
				});
				break;
			case 400:
			case 404:
				WriteIpfsTrace("IPFS ERROR", err);
				res.status(503).json({
					status: 503,
					error: RESPONSE_IPFS_SERVICE_DOWN,
				});
				break;
		}
	} else if (err instanceof AgorahError) {
		switch (err.code) {
			case AGORAH_ERROR_CODE_A1001:
			case AGORAH_ERROR_CODE_A1002:
			case AGORAH_ERROR_CODE_A1003:
			case AGORAH_ERROR_CODE_A1004:
			case AGORAH_ERROR_CODE_A1005:
			case AGORAH_ERROR_CODE_A1006:
			case AGORAH_ERROR_CODE_A1007:
			case AGORAH_ERROR_CODE_A1008:
			case AGORAH_ERROR_CODE_A1009:
			case AGORAH_ERROR_CODE_A1010:
			case AGORAH_ERROR_CODE_A1011:
			case AGORAH_ERROR_CODE_A1012:
			case AGORAH_ERROR_CODE_A1013:
			case AGORAH_ERROR_CODE_A1014:
			case AGORAH_ERROR_CODE_A1015:
			case AGORAH_ERROR_CODE_A1016:
			case AGORAH_ERROR_CODE_A1017:
			case AGORAH_ERROR_CODE_A1018:
			case AGORAH_ERROR_CODE_A1019:
			case AGORAH_ERROR_CODE_A1020:
			case AGORAH_ERROR_CODE_A1021:
				WriteUserInputTrace("AGORAH ERROR", err);
				res.status(418).json({
					status: 418,
					error: err.message,
				});
				break;
			//TODO: Do a default.
		}
	} else {
		console.log("%s: UNKNOWN ERROR - %s.", new Date().toUTCString(), err.message);
		res.status(500).json({
			status: 500,
			error: RESPONSE_UNEXPECTED_ERROR,
		});
	}

	if (env.GetEnableErrorStackTrace()) {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		console.log("ERROR CODE: %s - %s", (err as any).code, err.stack);
	}
}

export class PrismaError extends Error {
	code: string;

	constructor(code: string, message: string, stack: string | undefined) {
		super(message);
		this.stack = stack;
		this.code = code;
	}
}

// TODO: DO COMPREHENSIVE ERROR CATCHING EXERCISE, CHECK PRISMA CODES AND USE MOST LIKELY TO BE TRIGGERED BY US.
/**
 *
 * @param err
 * @param tokenId
 * @returns
 */
export async function ResolvePrismaError(
	err: unknown,
	tokenId: bigint | null
): Promise<void | collections> {
	if (err instanceof Prisma.PrismaClientKnownRequestError) {
		switch (err.code) {
			case PRISMA_ERROR_CODE_P2002:
				if (tokenId !== null) {
					// Trying to insert into collections which shouldn't be getting hit... So throw err.
					throw new PrismaError(err.code, PRISMA_CREATE_FAILURE_TOKEN_EXISTS, err.stack);
				} else {
					// Updating database with missing NFT's... Might have happened if someone early on went
					// rogue doing api requests and missing out parts of sequence i.e. 1-10 12-22.
					console.log(
						"%s: PRISMA ERROR - %s, %s.",
						new Date().toUTCString(),
						err.code,
						"possible cause: filling in incomplete data"
					);
				}
				break;
			case PRISMA_ERROR_CODE_P2025: {
				// TODO: Add collectionRequest type.
				const collection: collections | undefined =
					await GetCollectionInformationFromMirror(tokenId as bigint);
				return collection as collections;

				// TODO: Throw default.
			}
			case PRISMA_ERROR_CODE_P2033:
				throw new PrismaError(err.code, PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY, err.stack);
			default:
				throw new PrismaError(err.code, PRIMSA_UNACCOUNTED_FOR_ERROR, err.stack);
		}
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		throw new PrismaError(PRISMA_UNOFFICIAL_ERROR_CODE_UNKNOWN, err.message, err.stack);
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		throw new PrismaError(
			err.errorCode as string,
			PRISMA_DATABASE_CONNECTION_NOT_ESTABLISHED,
			err.stack
		);
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		throw new PrismaError(
			PRISMA_UNOFFICIAL_ERROR_CODE_VALIDATION_ERROR,
			PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY,
			err.stack
		);
	} else if (err instanceof Prisma.PrismaClientRustPanicError) {
		throw new PrismaError(PRISMA_UNOFFICIAL_ERROR_CODE_UNKNOWN, PRISMA_CLIENT_CRASH, err.stack);
	} else {
		throw new PrismaError(
			PRISMA_UNOFFICIAL_ERROR_CODE_UNKNOWN,
			PRIMSA_UNACCOUNTED_FOR_ERROR,
			// eslint-disable-next-line @typescript-eslint/no-explicit-any
			(err as any).stack
		);
	}
}

export class MirrorNodeError extends Error {
	code: number;

	constructor(code: number, message: string, stack: string | undefined) {
		super(message);
		this.stack = stack;
		this.code = code;
	}
}

export function ResolveMirrorError(err: unknown) {
	if (axios.isAxiosError(err)) {
		switch (err.response?.status) {
			case 400:
				throw new MirrorNodeError(400, AXIOS_400_MIRROR_NODE_REQUEST, err.stack);
			case 404:
				throw new MirrorNodeError(404, AXIOS_404_MIRROR_NODE_REQUEST, err.stack);
			default:
				throw new MirrorNodeError(0, AXIOS_DEFAULT_MIRROR_NODE_ERROR, err.stack);
		}
	} else {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		throw new MirrorNodeError(0, MIRROR_NODE_REQUEST_UNCAUGHT_ERROR, (err as any).stack);
	}
}

export class IpfsError extends Error {
	code: number;

	constructor(code: number, message: string, stack: string | undefined) {
		super(message);
		this.stack = stack;
		this.code = code;
	}
}

export function ResolveIpfsError(err: unknown) {
	if (axios.isAxiosError(err)) {
		switch (err.response?.status) {
			case 400:
				throw new IpfsError(400, AXIOS_400_IPFS_REQUEST, err.stack);
			case 404:
				throw new IpfsError(404, AXIOS_404_IPFS_REQUEST, err.stack);
			default:
				throw new IpfsError(0, AXIOS_DEFAULT_IPFS_ERROR, err.stack);
		}
	} else {
		// For non-axios related errors that are loosely coupled with the IPFS Data.
		// TODO: Extract this out into its own error class.
		const error: IpfsError = err as IpfsError;
		throw new IpfsError(error.code, error.message, error.stack);
	}
}

export class AgorahError extends Error {
	code: string;

	constructor(code: string, message: string, stack: string | undefined) {
		super(message);
		this.stack = stack;
		this.code = code;
	}
}

// This Resolver works different to the rest as its a native error system.
/**
 *
 * @param err
 * @param errCode
 */
export function ResolveAgorahError(err: Error) {
	switch (err.name) {
		case "SyntaxError": {
			// TODO: Fix this -- this may be triggered by curation.
			if (err.message.includes("BigInt")) {
				throw new AgorahError(
					AGORAH_ERROR_CODE_A1002,
					AGORAH_ERROR_MESSAGE_A1002,
					err.stack
				);
			} else {
				throw new AgorahError(
					AGORAH_ERROR_CODE_A1001,
					AGORAH_ERROR_MESSAGE_A1001,
					err.stack
				);
			}
		}
		case "TypeError":
			throw new AgorahError(AGORAH_ERROR_CODE_A1001, AGORAH_ERROR_MESSAGE_A1001, err.stack);
		case "Error":
			if (err.message === AGORAH_ERROR_MESSAGE_A1003) {
				throw new AgorahError(
					AGORAH_ERROR_CODE_A1003,
					AGORAH_ERROR_MESSAGE_A1003,
					err.stack
				);
			} else if (err.message === AGORAH_ERROR_MESSAGE_A1004) {
				throw new AgorahError(
					AGORAH_ERROR_CODE_A1004,
					AGORAH_ERROR_MESSAGE_A1004,
					err.stack
				);
			}
			break;
		default:
			throw new AgorahError(
				AGORAH_ERROR_MESSAGE_A0000,
				AGORAH_ERROR_MESSAGE_A0000,
				err.stack
			);
	}
}

function WriteUserInputTrace(type: string, err: AgorahError | PrismaError | MirrorNodeError) {
	if (env.GetEnableUserInputErrorInputTrace()) {
		console.log("%s: %s - %s, %s.", new Date().toUTCString(), type, err.code, err.message);
	}
}

function WriteIpfsTrace(
	type: string,
	err: AgorahError | PrismaError | MirrorNodeError | IpfsError
) {
	if (env.GetEnableIpfsErrorInputTrace()) {
		console.log("%s: %s - %s, %s.", new Date().toUTCString(), type, err.code, err.message);
	}
}
