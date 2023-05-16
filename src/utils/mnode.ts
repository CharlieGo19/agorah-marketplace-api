import { AxiosResponseNftCollection } from "../controllers/collection.interface";
import { env } from "../index";
import axios from "axios";
import { ResolveMirrorError } from "./error.handler";
import { MirrorNodeAccountNfts } from "../controllers/curation.interface";
import { MirrorNodeNftSerial } from "../controllers/nft.interface";

export class MirrorNode {
	ArkhiaApiVersion = "/api/v1"; // this is not part of the env. var because of how Arkhia give the next link.

	#axiosConfig = {
		headers: {
			"x-api-key": env.GetMirrorApiKeyI(),
		},
		baseURL: env.GetMirrorBaseUrlI(),
	};

	async MirrorRequestTokenInfo(
		collectionId: bigint
	): Promise<AxiosResponseNftCollection | undefined> {
		try {
			const collectionIdFull = `0.0.${collectionId}`;
			const getData = await axios.get<AxiosResponseNftCollection>(
				`${this.ArkhiaApiVersion}/tokens/${collectionIdFull}/`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}

	async MirrorRequestNfts(collectionId: bigint, from: bigint, to: bigint) {
		const limit: bigint = to - from + 1n;
		try {
			const collectionIdFull = `0.0.${collectionId}`;
			const getData = await axios.get(
				`${this.ArkhiaApiVersion}/tokens/${collectionIdFull}/nfts?limit=${limit}&order=asc&serialnumber=gte%3A${from}`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}

	async MirrorRequestNftSerial(
		collectionId: string,
		serial: string
	): Promise<MirrorNodeNftSerial | undefined> {
		try {
			const collectionIdFull = `0.0.${collectionId}`;
			const getData = await axios.get(
				`${this.ArkhiaApiVersion}/tokens/${collectionIdFull}/nfts/${serial}`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}

	// TODO: Return type
	async MirrorRequestAccountCuration(
		accountId: string
	): Promise<MirrorNodeAccountNfts | undefined> {
		try {
			if (env.GetEnableErrorStackTrace()) {
				console.log(
					`[DEBUG] Getting Account Token info from https://mainnet-public.mirrornode.hedera.com/api/v1/accounts/${accountId}/nfts?limit=100&order=asc`
				);
			}
			const getData = await axios.get(
				`${this.ArkhiaApiVersion}/accounts/${accountId}/nfts?limit=100&order=asc`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}

	async MirrorRequestFollowUpAccountCuration(
		nextUrl: string
	): Promise<MirrorNodeAccountNfts | undefined> {
		try {
			if (env.GetEnableErrorStackTrace()) {
				console.log(
					`[DEBUG] Next URL being called https://mainnet-public.mirrornode.hedera.com${nextUrl}`
				);
			}
			const getData = await axios.get(nextUrl, this.#axiosConfig);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}
}
