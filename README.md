# agorah-marketplace-api

API Powering Agorah Marketplace

# Dev Instructions

When first pulling this repo:

1. docker compose up : this will create database & tables.
2. npx prisma db pull : this will create schemas for prisma based on 1.
3. npx generate client : this will generate client based on 2.

# Potential Bugs:

What happens when token is infinate? Set hard limit to what we will store.

# TODO

1. Mon, 20 Mar 2023 09:30:37 GMT: PRISMA ERROR - P2002, possible cause: filling in incomplete data.
   Error may be getting triggered when data is out of range of NFT serials, put check in to ignore.
2. CloudFlare - check connections secure https://ipfs.agorah.io/QmRgphY9jM4Co4Z6vRLadsg2cyukn95gBEFF1afuELw1qp, need to do
   Additional Checks on headers coming back, then possibly trying Pinata?!
3. Move IPFS provider to env, with a backup.
4. Chnge how error handling works, if token in a list, i.e. curation, just remove the NFT thats problematic or add fields
   and add special additional property with err message, with a support link & we can implement.
5. Error interfaces for responses from Arkiha
