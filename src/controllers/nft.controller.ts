import { collections, nft } from "@prisma/client";
import { prisma } from "..";
import { AGORAH_ERROR_MESSAGE_A1003 } from "../utils/constants";
import {
	IpfsError,
	MirrorNodeError,
	PrismaError,
	ResolveAgorahError,
	ResolveIpfsError,
	ResolvePrismaError,
} from "../utils/error.handler";
import { GetMetaData } from "../utils/ipfs";
import { FuzzyTokenParser } from "../utils/metadata";
import { MirrorNode } from "../utils/mnode";
import { GetCollection } from "./collection.controller";
import { AxiosResponseNftSerials, FuzzyToken } from "./nft.interface";

/**
 *
 * @param collectionIdInput
 * @param nftSerialInput
 * @returns
 */
export async function GetNft(
	collectionIdInput: string,
	nftSerialInput: string
): Promise<nft | undefined> {
	try {
		const collectionId = BigInt(collectionIdInput.split(".")[2]);
		const nftSerial = BigInt(nftSerialInput);
		// TODO: bigInt PARSE Error.

		const collection: collections = (await GetCollection(collectionId)) as collections;
		// TODO: Add same last_synced check here (as nfts.controller.ts)
		if (nftSerial > collection.current_supply) {
			throw Error(AGORAH_ERROR_MESSAGE_A1003);
		}
		try {
			let result: nft | null = await prisma.nft.findFirst({
				where: {
					token_id: collectionId,
					serial_id: nftSerial,
				},
			});
			if (result === null) {
				const nftMirrorRecord: AxiosResponseNftSerials =
					await new MirrorNode().MirrorRequestNfts(collectionId, nftSerial, nftSerial);
				const metaData: FuzzyToken | undefined = await GetMetaData(
					nftMirrorRecord.nfts[0].metadata
				);
				try {
					result = FuzzyTokenParser(metaData as FuzzyToken, collectionId, nftSerial);
				} catch (err: unknown) {
					ResolveIpfsError(err);
				}

				try {
					await prisma.nft.create({
						data: result as nft,
					});
				} catch (err: unknown) {
					await ResolvePrismaError(err, null);
				}
			}
			return result as nft;
		} catch (err: unknown) {
			if (err instanceof PrismaError || IpfsError) {
				throw err;
			} else {
				await ResolvePrismaError(err, collectionId);
			}
		}
	} catch (err: unknown) {
		if (
			err instanceof MirrorNodeError ||
			err instanceof PrismaError ||
			err instanceof IpfsError
		) {
			// Throw the err, as it's already been resolved.
			console.log("Why haven't I hit this?");
			throw err;
		} else if (err instanceof Error) {
			ResolveAgorahError(err);
		}
	}
}
