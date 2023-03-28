import axios, { AxiosRequestConfig } from "axios";
import { FuzzyToken } from "../controllers/nft.interface";
import { ResolveIpfsError } from "./error.handler";

const IPFS_PROVIDER_CLOUDFLARE = "https://cloudflare-ipfs.com/ipfs";

const axiosConfig: AxiosRequestConfig = {
	baseURL: IPFS_PROVIDER_CLOUDFLARE,
};
export async function GetMetaData(cid: string): Promise<FuzzyToken | undefined> {
	try {
		const metaDataAddress = Buffer.from(cid, "base64").toLocaleString();
		if (metaDataAddress.includes("kns:")) {
			const KabutoNameServiceToken: FuzzyToken = {
				name: metaDataAddress.split(":")[1],
				creator: "Kabuto Name Service",
				image: "https://ns.kabuto.sh/api/default-name-image.png",
				typemime: "image/gif",
			};
			return KabutoNameServiceToken;
		} else {
			const ipfsMetaData = await axios.get(
				`/${Buffer.from(cid, "base64").toLocaleString().replace("ipfs://", "")}`,
				axiosConfig
			);
			return ipfsMetaData.data;
		}
	} catch (err) {
		ResolveIpfsError(err);
	}
}
