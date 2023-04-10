import axios, { AxiosRequestConfig } from "axios";
import { FuzzyToken } from "../controllers/nft.interface";
import { ResolveIpfsError } from "./error.handler";
import { env } from "..";

const IPFS_PROVIDER_CLOUDFLARE = "https://cloudflare-ipfs.com/ipfs";

const axiosConfig: AxiosRequestConfig = {
	baseURL: IPFS_PROVIDER_CLOUDFLARE,
};

/**
 *
 * @param cid {string} CIDv1 | v0
 * @returns raw metadata from mirror IPFS, unless it's a name service, where it is amended to conform to HIP412.
 */
export async function GetMetaData(cid: string): Promise<FuzzyToken | undefined> {
	const cidregex =
		/Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;
	try {
		const metaDataAddress = Buffer.from(cid, "base64").toLocaleString();
		if (env.GetEnableErrorStackTrace()) {
			console.log("[DEBUG] metaDataAddress: ", metaDataAddress);
		}
		if (metaDataAddress.includes("kns:")) {
			const KabutoNameServiceToken: FuzzyToken = {
				name: metaDataAddress.split(":")[1],
				creator: "Kabuto Name Service",
				image: "https://ns.kabuto.sh/api/default-name-image.png",
				typemime: "image/gif",
			};
			return KabutoNameServiceToken;
		} else if (metaDataAddress.includes("ipfs://")) {
			const ipfsMetaData = await axios.get(
				`/${metaDataAddress.replace("ipfs://", "")}`,
				axiosConfig
			);
			return ipfsMetaData.data;
		} else if (cidregex.test(metaDataAddress)) {
			const ipfsMetaData = await axios.get(metaDataAddress, axiosConfig);
			if (env.GetEnableErrorStackTrace()) {
				console.log(`[DEBUG] IPFS Metadata: ${JSON.stringify(ipfsMetaData.data)}`);
			}
			return ipfsMetaData.data;
		} else if (metaDataAddress.includes("https://") || metaDataAddress.includes("http://")) {
			// For weird edge cases where they host their own stuff.
			axiosConfig.baseURL = metaDataAddress;
			const ipfsMetaData = await axios.get("", axiosConfig);
			return ipfsMetaData.data;
		}
	} catch (err) {
		ResolveIpfsError(err);
	}
}
