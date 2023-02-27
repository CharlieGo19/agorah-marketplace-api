import { collections, Prisma } from "@prisma/client";
import axios from "axios";
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
	PRISMA_ERROR_CODE_UNKNOWN,
	RESPONSE_TOKEN_NOT_FOUND,
	RESPONSE_BAD_PARAM_REFUSED,
	RESPONSE_UNEXPECTED_ERROR,
	RESPONSE_MIRROR_NODE_SERVICE_DOWN,
} from "./constants";

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export function errorHandler(err: Error, _req: Request, res: Response, next: NextFunction) {
	if (err instanceof PrismaError) {
		console.log("%s: PRISMA ERROR - %s, %s.", new Date().toUTCString(), err.code, err.message);
		switch (err.code) {
			case PRISMA_ERROR_CODE_P2033:
				res.status(400).json({
					status: 400,
					error: RESPONSE_BAD_PARAM_REFUSED,
				});
				break;
			// TODO: FINISH THESE.
		}
	} else if (err instanceof MirrorNodeError) {
		switch (err.code) {
			case 400:
			case 404:
				if (env.GetEnableUserInputErrorInputTrace()) {
					console.log("%s: MIRROR NODE ERROR - %s, %s.", new Date().toUTCString());
				}
				res.status(404).json({
					status: 404,
					error: RESPONSE_TOKEN_NOT_FOUND,
				});
				break;
			case 0:
				console.log(
					"%s: MIRROR NODE ERROR - %s, %s",
					new Date().toUTCString,
					err.code,
					err.message
				);
				res.status(503).json({
					status: 503,
					error: RESPONSE_MIRROR_NODE_SERVICE_DOWN,
				});
		}
	} else {
		console.log("%s: UNKNOWN ERROR - %s.", new Date().toUTCString(), err.message);
		res.status(500).json({
			status: 500,
			error: RESPONSE_UNEXPECTED_ERROR,
		});
	}

	if (env.GetEnableErrorStackTrace()) {
		console.log("stack: ", err.stack);
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
				throw new PrismaError(err.code, PRISMA_CREATE_FAILURE_TOKEN_EXISTS, err.stack);
			case PRISMA_ERROR_CODE_P2025: {
				const collection: collections | undefined =
					await GetCollectionInformationFromMirror(tokenId as bigint);
				return collection as collections;
			}
			case PRISMA_ERROR_CODE_P2033:
				throw new PrismaError(err.code, PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY, err.stack);
			default:
				throw new PrismaError(err.code, PRIMSA_UNACCOUNTED_FOR_ERROR, err.stack);
		}
	} else if (err instanceof Prisma.PrismaClientUnknownRequestError) {
		throw new PrismaError(PRISMA_ERROR_CODE_UNKNOWN, err.message, err.stack);
	} else if (err instanceof Prisma.PrismaClientInitializationError) {
		throw new PrismaError(
			err.errorCode as string,
			PRISMA_DATABASE_CONNECTION_NOT_ESTABLISHED,
			err.stack
		);
	} else if (err instanceof Prisma.PrismaClientValidationError) {
		throw new PrismaError(
			PRISMA_ERROR_CODE_UNKNOWN,
			PRISMA_BAD_PAYLOAD_PROVIDED_FOR_QUERY,
			err.stack
		);
	} else if (err instanceof Prisma.PrismaClientRustPanicError) {
		throw new PrismaError(PRISMA_ERROR_CODE_UNKNOWN, PRISMA_CLIENT_CRASH, err.stack);
	} else {
		throw new PrismaError(
			PRISMA_ERROR_CODE_UNKNOWN,
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

export function ResolveMirrorNodeError(err: unknown) {
	if (axios.isAxiosError(err)) {
		switch (err.response?.status) {
			case 400:
				throw new MirrorNodeError(400, AXIOS_400_MIRROR_NODE_REQUEST, err.stack);
			case 404:
				throw new MirrorNodeError(400, AXIOS_404_MIRROR_NODE_REQUEST, err.stack);
			default:
				throw new MirrorNodeError(0, AXIOS_DEFAULT_MIRROR_NODE_ERROR, err.stack);
		}
	} else {
		// eslint-disable-next-line @typescript-eslint/no-explicit-any
		throw new MirrorNodeError(0, MIRROR_NODE_REQUEST_UNCAUGHT_ERROR, (err as any).stack);
	}
}
