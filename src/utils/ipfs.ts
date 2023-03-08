import axios, { AxiosRequestConfig } from "axios";
import { FuzzyToken } from "../controllers/nft.interface";

const IPFS_PROVIDER_CLOUDFLARE = "https://cloudflare-ipfs.com/ipfs";

const axiosConfig: AxiosRequestConfig = {
	baseURL: IPFS_PROVIDER_CLOUDFLARE,
};
export async function GetMetaData(cid: string): Promise<FuzzyToken | undefined> {
	// Test if whoever made the NFT, encoded the CID, if they have, we need to decode it.
	// const regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
	// if (regex.test(cid)) {
	// 	cid = Buffer.from(cid, "base64").toLocaleString().replace("ipfs://", "");
	// }

	const ipfsMetaData = await axios.get(
		`/${Buffer.from(cid, "base64").toLocaleString().replace("ipfs://", "")}`,
		axiosConfig
	); //axios.get(CloudFlareConfig(cid));
	return ipfsMetaData.data;
}

function CloudFlareConfig(cid: string) {
	return {
		method: "get",
		url: `${IPFS_PROVIDER_CLOUDFLARE}/${Buffer.from(cid, "base64")}`,
	};
}
