import { nft } from "@prisma/client";
import { AGORAH_ERROR_MESSAGE_A1004 } from "../utils/constants";
import {
	IpfsError,
	MirrorNodeError,
	PrismaError,
	ResolveAgorahError,
} from "../utils/error.handler";
import { MirrorNode } from "../utils/mnode";
import { MirrorNodeAccountNfts, MirrorNodeNfts } from "./curation.interface";
import { GetNft } from "./nft.controller";

export async function GetCuration(accountId: string) {
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
			const userCuration: MirrorNodeNfts[] = []; // TODO: Test -- unsure if this is in scope of anonfunc below.
			const GetSubseuqentNfts = async function (nextUrl: string | null) {
				if (nextUrl === null) {
					return;
				}

				const subsequentUserCurationRequest: MirrorNodeAccountNfts =
					(await new MirrorNode().MirrorRequestFollowUpAccountCuration(
						nextUrl
					)) as MirrorNodeAccountNfts;
				userCuration.push(...subsequentUserCurationRequest.nfts);
				GetSubseuqentNfts(subsequentUserCurationRequest.links.next);
			};

			const usersCurationRequest: MirrorNodeAccountNfts =
				(await new MirrorNode().MirrorRequestAccountCuration(
					accountId
				)) as MirrorNodeAccountNfts;
			userCuration.push(...usersCurationRequest.nfts);
			GetSubseuqentNfts(usersCurationRequest.links.next);

			const dataToReturn: nft[] = [];
			userCuration.forEach(async (nft: MirrorNodeNfts) => {
				dataToReturn.push(
					(await GetNft(nft.token_id, nft.serial_number.toString())) as nft
				);
			});
			// once we figure out whats causing this, figure lut with PrismaError has not been resoved.
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
