# agorah-marketplace-api

API Powering Agorah Marketplace

# Dev Instructions

When first pulling this repo:

1. docker compose up : this will create database & tables.
2. npx prisma db pull : this will create schemas for prisma based on 1.
3. npx generate client : this will generate client based on 2.
