import { AxiosResponseNftCollection } from "../controllers/collection.interface";
import { env } from "../index";
import axios from "axios";
import { ResolveMirrorError } from "./error.handler";

export class MirrorNode {
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
				`/tokens/${collectionIdFull}/`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}

	async MirrorRequestNfts(collectionId: bigint, from: number, to: number) {
		const limit: number = to - from + 1;
		try {
			const collectionIdFull = `0.0.${collectionId}`;
			const getData = await axios.get(
				`/tokens/${collectionIdFull}/nfts?limit=${limit}&order=asc&serialnumber=gte%3A${from}`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (err) {
			ResolveMirrorError(err);
		}
	}
}
