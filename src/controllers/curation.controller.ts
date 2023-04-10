import { nft } from "@prisma/client";
import { AGORAH_ERROR_MESSAGE_A1004 } from "../utils/constants";
import {
	IpfsError,
	MirrorNodeError,
	PrismaError,
	ResolveAgorahError,
} from "../utils/error.handler";
import { MirrorNode } from "../utils/mnode";
import { CuratedNft, MirrorNodeAccountNfts, MirrorNodeNfts } from "./curation.interface";
import { GetNft } from "./nft.controller";
import { env } from "..";

/**
 * @async
 * @function GetCuration
 * @summary Gets the curation of a given account.
 * @param {string} accountId - The Hedera Account ID of the user to get the curation of.
 * @returns {Promise<CuratedNft[] | undefined>} - Returns an array of curated NFTs.
 * @throws {MirrorNodeError} - If the MirrorNode returns an error.
 * @throws {IpfsError} - If the IPFS node returns an error.
 * @throws {PrismaError} - If the Prisma client returns an error.
 * @throws {Error} - If the input is invalid.
 */
export async function GetCuration(accountId: string): Promise<CuratedNft[] | undefined> {
	const splitAccountId: string[] = accountId.split(".");

	// TODO: If sharding is ever implemented - this is will need revising.
	// We're doing these checks to ensure user has provided the correct input
	// If they haven't we should not waste valuable api requests on a failed request.
	try {
		if (
			splitAccountId.length !== 3 ||
			splitAccountId[0] !== "0" ||
			splitAccountId[1] !== "0" ||
			!splitAccountId[2].match(/^[0-9]+$/i)
		) {
			throw new Error(AGORAH_ERROR_MESSAGE_A1004);
		} else {
			const userCuration: MirrorNodeNfts[] = [];

			const GetSubseuqentNfts = async function (nextUrl: string | null) {
				if (nextUrl === null) {
					return;
				}
				const subsequentUserCurationRequest: MirrorNodeAccountNfts =
					(await new MirrorNode().MirrorRequestFollowUpAccountCuration(
						nextUrl
					)) as MirrorNodeAccountNfts;
				userCuration.push(...subsequentUserCurationRequest.nfts);
				await GetSubseuqentNfts(subsequentUserCurationRequest.links.next);
			};

			const usersCurationRequest: MirrorNodeAccountNfts =
				(await new MirrorNode().MirrorRequestAccountCuration(
					accountId
				)) as MirrorNodeAccountNfts;

			userCuration.push(...usersCurationRequest.nfts);
			await GetSubseuqentNfts(usersCurationRequest.links.next);

			const dataToReturn: CuratedNft[] = [];

			for (const token of userCuration) {
				const data: nft = (await GetNft(
					token.token_id,
					token.serial_number.toString()
				)) as nft;

				const valueToReturn: CuratedNft = {
					name: data.nft_name as string,
					src: data.nft_file,
					collection: data.token_id.toString(),
					serial: data.serial_id.toString(),
					forSale: false, // TODO: Implement.
				};
				dataToReturn.push(valueToReturn);
			}
			// once we figure out whats causing this, figure lut with PrismaError has not been resoved.

			if (env.GetEnableErrorStackTrace()) {
				console.log(`[DEBUG] GetCuration Returned Set Size: ${dataToReturn.length}`);
			}
			return dataToReturn;
		}
		//
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
