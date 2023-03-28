CREATE TABLE IF NOT EXISTS collections (
    token_id BIGINT NOT NULL UNIQUE,
    token_name VARCHAR(100) NOT NULL,
    token_symbol VARCHAR(100) NOT NULL,
    current_supply BIGINT NOT NULL,
    max_supply BIGINT NOT NULL,
    royalty_fee DECIMAL[] NOT NULL DEFAULT '{}',
    royalty_collector BIGINT[] NOT NULL DEFAULT '{}',
    royalty_fallback_fee_amount BIGINT[] NOT NULL DEFAULT '{}',
    royalty_fallback_fee_token BIGINT[] NOT NULL DEFAULT '{}',
    freeze_key BOOLEAN NOT NULL DEFAULT false,
    wipe_key BOOLEAN NOT NULL DEFAULT false,
    supply_key BOOLEAN NOT NULL DEFAULT false,
    last_synced TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (token_id)
);

-- token_name limit is based on HAPI limit of 100 characters.
-- the above needs to be closely monitored.

CREATE TABLE IF NOT EXISTS nft (
    token_id BIGINT NOT NULL REFERENCES collections(token_id),
    serial_id INT NOT NULL,
    nft_name VARCHAR(512),
    nft_creator VARCHAR(128),
    nft_description TEXT,
    nft_file VARCHAR(1024) NOT NULL,
    nft_file_checksum VARCHAR(64),
    nft_additional_files BOOLEAN NOT NULL DEFAULT false,
    nft_properties TEXT,
    nft_locales VARCHAR(128) NOT NULL DEFAULT 'en-GB',
    PRIMARY KEY (token_id, serial_id)
);

-- provided generous 1MB for nft image, as not all creators will use IPFS.
-- nft properties will hold a standardised JSON string.

CREATE TABLE IF NOT EXISTS nft_additional_files (
    token_id BIGINT NOT NULL,
    serial_id INT NOT NULL,
    file_index INT NOT NULL,
    additional_nft_file VARCHAR(1024) NOT NULL,
    additional_nft_file_checkshum VARCHAR(64),
    additional_nft_file_mime_type VARCHAR(64),
    additional_nft_file_metadata TEXT,
    additional_nft_file_metadata_uri VARCHAR(1024),
    PRIMARY KEY (token_id, serial_id, file_index)
);

-- TODO: reference nft table, or set a contraint that token_id and serial_id must exist for an entry into nft_additional_files.

CREATE TABLE IF NOT EXISTS platform_metrics(
    mirror_node_api_request BIGINT NOT NULL DEFAULT 0
);

-- Optimisations:
CREATE INDEX nft_token_id_idx ON nft (token_id);
