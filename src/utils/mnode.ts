import { AxiosResponseNftCollection } from "../controllers/collection.interface";
import { env } from "../index";
import axios from "axios";
import { ResolveMirrorNodeError } from "./error.handler";

export class MirrorNode {
	#axiosConfig = {
		headers: {
			"x-api-key": env.GetMirrorApiKeyI(),
		},
		baseURL: env.GetMirrorBaseUrlI(),
	};

	async MirrorRequestTokenInfo(tokenId: bigint): Promise<AxiosResponseNftCollection | undefined> {
		try {
			const tokenIdFull = `0.0.${tokenId}`;
			const getData = await axios.get<AxiosResponseNftCollection>(
				`/tokens/${tokenIdFull}/`,
				this.#axiosConfig
			);
			return getData.data;
		} catch (e) {
			ResolveMirrorNodeError(e);
		}
	}
}
