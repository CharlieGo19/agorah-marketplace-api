import { nft } from "@prisma/client";
import { FuzzyToken } from "../controllers/nft.interface";
import { AGORAH_ERROR_PLACEHOLDER_IMAGE, METADATA_NO_PARSABLE_IMAGE } from "./constants";
import { IpfsError } from "./error.handler";

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
	serialId: number
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
	};

	if (metadata.image !== undefined) {
		if (metadata.image.includes("ipfs://")) {
			nftTableMetadata.nft_file = metadata.image.replace("ipfs://", "");
		} else if (metadata.image.includes("https://")) {
			// For content stored somewhere other than IPFS.
			// Only allow secure connections.
			nftTableMetadata.nft_file = metadata.image;
		} else {
			// TODO: Should have own error class TBH.
			throw new IpfsError(0, METADATA_NO_PARSABLE_IMAGE, undefined);
		}
	} else {
		throw new IpfsError(0, METADATA_NO_PARSABLE_IMAGE, undefined);
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
		nftTableMetadata.nft_description = metadata.description;
	}

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.checksum !== undefined) {
		nftTableMetadata.nft_file_checksum = metadata.checksum;
	}

	// TODO: ADDITIONAL FILES.

	// TODO: Clipping, if exceeds the 1MB limit, cut it.
	if (metadata.properties !== undefined) {
		if (metadata.attributes !== undefined) {
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
