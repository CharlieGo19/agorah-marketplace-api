import { nft } from "@prisma/client";
import { env } from "..";
import { FuzzyToken, FuzzyTokenProperties } from "../controllers/nft.interface";
import { AGORAH_ERROR_PLACEHOLDER_IMAGE, METADATA_NO_PARSABLE_IMAGE } from "./constants";
import { IpfsError } from "./error.handler";

// TODO: !! URGENT !! IF properties | attributes fail, just discard and set null but let token be submitted, then log problem.
/**
 *
 * @param metadata {FuzzyToken} metadata retrieved from IPFS.
 * @param collectionId {bigint} collection to which the serialId belongs
 * @param serialId {number} serial to which the metadata belongs
 * @returns {Prisma.nft} returns data in the basic format of HIP-412, ready to be submitted to DB.
 */
export function FuzzyTokenParser(
	metadata: FuzzyToken,
	collectionId: bigint,
	serialId: bigint
): nft {
	const nftTableMetadata: nft = {
		token_id: collectionId,
		serial_id: serialId,
		nft_file: AGORAH_ERROR_PLACEHOLDER_IMAGE, // should never really be hit.
		nft_name: null,
		nft_creator: null,
		nft_description: null,
		nft_file_checksum: null,
		nft_additional_files: false,
		nft_properties: null,
		nft_locales: "",
		for_sale: false,
	};
	if (metadata.image !== undefined) {
		const cidregex =
			/Qm[1-9A-HJ-NP-Za-km-z]{44,}|b[A-Za-z2-7]{58,}|B[A-Z2-7]{58,}|z[1-9A-HJ-NP-Za-km-z]{48,}|F[0-9A-F]{50,}/;
		if (typeof metadata.image !== "string" && "type" in metadata.image) {
			if (metadata.image.description.includes("://")) {
				metadata.image = metadata.image.description;
			} else {
				metadata.image = `ipfs://${metadata.image.description}`; // HashAxis, yet again: 0.0.637623
			}
		}

		if (typeof metadata.image === "string") {
			if (metadata.image.includes("ipfs://")) {
				nftTableMetadata.nft_file = metadata.image.replace(
					"ipfs://",
					`${env.GetAgorahIPFSDomain()}/`
				);
			} else if (metadata.image.includes("https://")) {
				// For content stored somewhere other than IPFS.
				// Only allow secure connections.
				nftTableMetadata.nft_file = metadata.image;
			} else if (cidregex.test(metadata.image)) {
				nftTableMetadata.nft_file = `${env.GetAgorahIPFSDomain()}/${metadata.image}`; //0.0.1234197
			} else {
				// TODO: Should have own error class TBH.
				throw new IpfsError(0, METADATA_NO_PARSABLE_IMAGE, undefined);
			}
		}
		// }else if(metadata.image.includes("")){
	} else if (metadata.CID !== undefined) {
		if (metadata.CID.includes("ipfs://")) {
			nftTableMetadata.nft_file = metadata.CID.replace(
				"ipfs://",
				`${env.GetAgorahIPFSDomain()}/`
			);
		} else if (metadata.CID.includes("https://")) {
			nftTableMetadata.nft_file = metadata.CID;
		} else {
			// TODO: Should have own error class TBH.
			throw new IpfsError(0, METADATA_NO_PARSABLE_IMAGE, undefined);
		}
	} else {
		throw new IpfsError(0, METADATA_NO_PARSABLE_IMAGE, undefined); // TODO: Spacebar should trigger this error...
	}

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.name !== undefined) {
		nftTableMetadata.nft_name = metadata.name;
	}

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.creator !== undefined) {
		nftTableMetadata.nft_creator = metadata.creator;
	}

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.description !== undefined) {
		if (typeof metadata.description !== "string" && "type" in metadata.description) {
			nftTableMetadata.nft_description = metadata.description.description;
		} else {
			nftTableMetadata.nft_description = metadata.description;
		}
	}

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.checksum !== undefined) {
		nftTableMetadata.nft_file_checksum = metadata.checksum;
	}

	// TODO: ADDITIONAL FILES.

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (
		metadata.properties !== undefined &&
		metadata.properties !== null &&
		metadata.properties !== "null"
	) {
		if (metadata.attributes !== undefined) {
			if (typeof metadata.properties === "string") {
				const old: string = metadata.properties;
				metadata.properties = {};
				if (old.includes("twitter")) {
					metadata.properties.socials = [
						{
							platform: "twitter",
							value: old,
						},
					];
				}
			}

			// move atrributes to properties, the place  is should be
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			metadata.properties["attributes"] = metadata.attributes;
		}
		nftTableMetadata.nft_properties = JSON.stringify(metadata.properties); // TODO: do something more than this.
	}
	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.localization === undefined) {
		nftTableMetadata.nft_locales = "en-GB";
	} else {
		nftTableMetadata.nft_locales = JSON.stringify(metadata.localization);
	}
	return nftTableMetadata;
}
