## Installation

```bash
$ npm install
```

## Migrations

NOTE: If this application is run inside docker then these script should be run inside docker container shell
(exec sh) since we need env variable

All migrations file generated will be in `src/database-config/migrations`

### Step 1.

Generate an `ormconfig.json` so we can use typeorm cli to run migration commands.

```bash
$ npm run pretypeorm
```

### Step 2:

To create a blank migration file, run

```bash
$ npm run typeorm:migration:create -- <my_migration_file>
```

To generate migration file based on database changes

```bash
$ npm run typeorm:migration:generate -- <my_migration_file>
```

### Step 3:

To run the migrations (will run all migration files in `src/database-config/migrations`)

```bash
$ npm run typeorm:migration:run
```

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests
$ npm run test

# e2e tests
$ npm run test:e2e

# test coverage
$ npm run test:cov
```
