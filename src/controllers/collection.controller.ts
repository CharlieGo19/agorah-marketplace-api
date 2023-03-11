import { Prisma, collections } from "@prisma/client";
import { prisma } from "../index";
import { ResolvePrismaError } from "../utils/error.handler";
import { MirrorNode } from "../utils/mnode";
import { AxiosResponseNftCollection, RoyaltyFees } from "./collection.interface";

// TODO: Implement last_sync check if token not at capacitiy to see if new additions.
/**
 *
 * @param tokenId
 * @returns
 */
export async function GetCollection(tokenId: bigint): Promise<collections | undefined> {
	try {
		const result: collections = await prisma.collections.findUniqueOrThrow({
			where: {
				token_id: tokenId,
			},
		});

		return result;
	} catch (e) {
		return (await ResolvePrismaError(e, tokenId)) as collections;
	}
}

/**
 *
 * @param tokenId
 * @returns
 */
export async function GetCollectionInformationFromMirror(
	tokenId: bigint
): Promise<collections | undefined> {
	const mirrorNodeRequest: MirrorNode = new MirrorNode();
	const nftReturnData: AxiosResponseNftCollection =
		(await mirrorNodeRequest.MirrorRequestTokenInfo(tokenId)) as AxiosResponseNftCollection;

	const royalty_fees: Prisma.Decimal[] = [];
	const royalty_collectors: bigint[] = [];
	const royalty_fallback_fee_amounts: bigint[] = [];
	const royalty_fallback_fee_tokens: bigint[] = [];

	for (const i in nftReturnData.custom_fees.royalty_fees) {
		const returnedFee: RoyaltyFees = nftReturnData.custom_fees.royalty_fees[i];

		royalty_fees.push(
			new Prisma.Decimal(returnedFee.amount.numerator / returnedFee.amount.denominator)
		);

		royalty_collectors.push(BigInt(returnedFee.collector_account_id.split(".")[2]));

		// if fallback does not exist, default 0, if token is null, set to 0 also, then in frontend set to hbar
		if (returnedFee.fallback_fee !== null && returnedFee.fallback_fee !== undefined) {
			royalty_fallback_fee_amounts.push(BigInt(returnedFee.fallback_fee?.amount as number));

			if (
				returnedFee.fallback_fee?.denominating_token_id !== null &&
				returnedFee.fallback_fee?.denominating_token_id !== undefined
			) {
				royalty_fallback_fee_tokens.push(
					BigInt(
						(returnedFee.fallback_fee?.denominating_token_id as string).split(".")[2]
					)
				);
			} else {
				// If no token is set then the default is 0.0.0 ~ Hbar.
				royalty_fallback_fee_tokens.push(BigInt(0));
			}
		}
	}

	const nftCollection: collections = {
		token_id: BigInt(nftReturnData.token_id.split(".")[2]),
		token_name: nftReturnData.name,
		token_symbol: nftReturnData.symbol,
		current_supply: Number(nftReturnData.total_supply),
		max_supply: Number(nftReturnData.max_supply),
		royalty_fee: royalty_fees,
		royalty_collector: royalty_collectors,
		royalty_fallback_fee_amount: royalty_fallback_fee_amounts,
		royalty_fallback_fee_token: royalty_fallback_fee_tokens,
		freeze_key:
			nftReturnData.freeze_key === undefined || nftReturnData.freeze_key === null
				? false
				: true,
		wipe_key:
			nftReturnData.wipe_key === undefined || nftReturnData.wipe_key === null ? false : true,
		supply_key:
			nftReturnData.supply_key === undefined || nftReturnData.supply_key === null
				? false
				: true,
		last_synced: new Date(),
	};

	try {
		const prismaInsertCollection: collections = await prisma.collections.create({
			data: nftCollection,
		});

		return prismaInsertCollection;
	} catch (e) {
		ResolvePrismaError(e, null);
	}
}
