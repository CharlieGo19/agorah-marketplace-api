import { prisma } from "..";

interface Results {
	token_ids?: string[];
	nfts?: string[];
	users?: string[];
}
export async function SearchAgorah(value: string) {
	const results: Results = {
		token_ids: [],
		nfts: [],
		users: [],
	};
	const startOfToken = "0.0.";
	const regExpToken = new RegExp(startOfToken);

	if (regExpToken.test(value)) {
		const tokenId: string = value.split(".")[2] + "%"; // TODO: check this value, make sure not malicious.
		if (tokenId === null || tokenId === undefined || tokenId.length < 4) {
			return [];
		}
		const foundTokenIds: { token_id: string }[] =
			await prisma.$queryRaw`SELECT DISTINCT token_id FROM nft WHERE CAST(token_id AS TEXT) LIKE ${tokenId};`;

		if (foundTokenIds.length > 0) {
			for (const returedId of foundTokenIds) {
				(results.token_ids as string[]).push(`${startOfToken}${returedId.token_id}`);
			}
		}
	}

	return results;
}
