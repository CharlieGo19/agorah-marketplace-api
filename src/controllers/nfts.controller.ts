import { collections, nft } from "@prisma/client";
import { env, prisma } from "..";
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
import { GetCollection, GetCollectionInformationFromMirror } from "./collection.controller";
import { AxiosResponseNftSerials, FuzzyToken } from "./nft.interface";

// TODO: Implement additional files.

// for browsing.
export async function GetNftPreviewsRange(
	collectionIdInput: string,
	nftSerialRangeFromInput: string,
	nftSerialRangeToInput: string
) {
	try {
		const collectionId = BigInt(collectionIdInput.split(".")[2]);
		const nftSerialRangeFrom = Number(nftSerialRangeFromInput);
		const nftSerialRangeTo = Number(nftSerialRangeToInput);
		const numberOfNftsRequested = nftSerialRangeTo - nftSerialRangeFrom + 1; // Because serials start at 1.
		let isNftDataComplete = false;

		if (isNaN(nftSerialRangeFrom) || isNaN(nftSerialRangeTo)) {
			throw new SyntaxError("NaN found when converting string to number");
		}

		if (nftSerialRangeTo < nftSerialRangeFrom || nftSerialRangeFrom <= 0) {
			throw Error(AGORAH_ERROR_MESSAGE_A1003);
		}

		if (numberOfNftsRequested > env.GetNftRequestRangeLimit()) {
			throw Error(AGORAH_ERROR_MESSAGE_A1003);
		}

		const collection: collections = (await GetCollection(collectionId)) as collections;

		if (nftSerialRangeFrom > collection.current_supply) {
			throw Error(AGORAH_ERROR_MESSAGE_A1003);
		}

		if (collection.current_supply == collection.max_supply) {
			isNftDataComplete = true;
		}

		const result: nft[] = await prisma.nft.findMany({
			take: numberOfNftsRequested,
			cursor: {
				token_id_serial_id: {
					token_id: collectionId,
					serial_id: nftSerialRangeFrom,
				},
			},
			where: {
				token_id: collectionId,
			},
			orderBy: {
				serial_id: "asc",
			},
		});

		// Data is complete and the return data confirms this, we are safe to return the result.
		if (isNftDataComplete && result.length == numberOfNftsRequested) {
			return result;
		} else if (nftSerialRangeTo < collection.current_supply) {
			if (result.length === numberOfNftsRequested) {
				return result;
			} else {
				const nfts: AxiosResponseNftSerials = await new MirrorNode().MirrorRequestNfts(
					collectionId,
					nftSerialRangeFrom,
					nftSerialRangeTo
				);
				const dataToInsert: nft[] = [];
				for (const val of nfts.nfts) {
					const metaData: FuzzyToken | undefined = await GetMetaData(val.metadata);
					try {
						const cleanData = FuzzyTokenParser(
							metaData as FuzzyToken,
							collectionId,
							val.serial_number
						);
						dataToInsert.push(cleanData);
					} catch (err) {
						ResolveIpfsError(err);
					}
				}

				try {
					await prisma.nft.createMany({
						data: dataToInsert,
						skipDuplicates: true,
					});

					return dataToInsert;
				} catch (err: unknown) {
					ResolvePrismaError(err, null);
				}
				console.log("Here?");
			}
		} else {
			// we're here because the collection information indicates an incomplete set, and may need updating
			// and that we're at the fringe of our knowledge. This is not perfect solution.
			// TODO: Implement last_synced check to remove the need for this.
			const expectedSetSize = collection.current_supply - nftSerialRangeFrom;
			console.log(expectedSetSize);
			const nfts: AxiosResponseNftSerials = await new MirrorNode().MirrorRequestNfts(
				collectionId,
				nftSerialRangeFrom,
				nftSerialRangeTo
			);
			const dataToInsert: nft[] = [];
			for (const val of nfts.nfts) {
				const metaData: FuzzyToken | undefined = await GetMetaData(val.metadata);
				try {
					const cleanData = FuzzyTokenParser(
						metaData as FuzzyToken,
						collectionId,
						val.serial_number
					);
					dataToInsert.push(cleanData);
				} catch (err) {
					ResolveIpfsError(err);
				}
			}

			if (dataToInsert.length > expectedSetSize) {
				GetCollectionInformationFromMirror(collectionId);
			}

			try {
				await prisma.nft.createMany({
					data: dataToInsert,
					skipDuplicates: true,
				});

				return dataToInsert;
			} catch (err: unknown) {
				ResolvePrismaError(err, null);
			}
		}
	} catch (err: unknown) {
		if (
			err instanceof MirrorNodeError ||
			err instanceof PrismaError ||
			err instanceof IpfsError
		) {
			// Throw the err, as it's already been resolved.
			throw err;
		} else if (err instanceof Error) {
			ResolveAgorahError(err);
		}
	}
}
