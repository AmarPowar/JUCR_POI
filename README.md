# JUCR Assignment POI Data Import Microservice 



## Quick Start

Git Clone :

```bash
git clone https://github.com/AmarPowar/JUCR_POI.git
```

npm install:

```bash
npm install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

Run Command :

```bash
npm start
```

Setup MongoDB and Use Url Like Below :

```bash
MONGO_URI='mongodb://user:password@localhost:27017/poi_db?authSource=admin'
```


Testing:

```bash
# run all tests
npm  test

# run test coverage
npm  coverage
```

Docker:

```bash
# run docker container in development mode
npm run  docker:dev

```

Linting:

```bash
# run ESLint

npm run lint
```

## Environment Variables

The environment variables can be found and modified in the `.env` file. They come with these default values:

```bash
# Port number
PORT=3000

# URL of the Mongo 
MONGO_URI='mongodb://user:password@localhost:27017/poi_db?authSource=admin'
# OPENCHARGEMAP_API_KEY
OPENCHARGEMAP_API_KEY='xxxxxx-xxx-xx-xxxxxx-xxxxxxxxxx'
# OPEN_CHARGE_MAP_BASE_URL
OPEN_CHARGE_MAP_BASE_URL='https://api.openchargemap.io/v3/'
# CONCURRENCY_LIMIT
CONCURRENCY_LIMIT=10


# URL of client application
CLIENT_URL=http://localhost:5000
```

## Project Structure

```
.
├── src                             # Source files
│   ├── app.ts                        # Express App
│   ├── config                        # Environment variables and other configurations
│   ├── custom.d.ts                   # File for extending types from node modules
│   ├── declaration.d.ts              # File for declaring modules without types
│   ├── index.ts                      # App entry file
│   ├── modules                       # Modules such as models, controllers, services 
│   └── routes                        # Routes
├── TODO.md                         # TODO List
├── package.json
└── README.md
```

## API Documentation

To view the list of available APIs and their specifications, run the server and go to `http://localhost:3005/api-docs/` in your browser. This documentation page is automatically generated using the [swagger](https://swagger.io/) definitions written as comments in the route files.

### API Endpoints

List of available routes:

**Import Data POIs routes**:\
`POST http://localhost:3005/v1/import-data` - import-data\


## Validation

Request data is validated using [Joi](https://joi.dev/). Check the [documentation](https://joi.dev/api/) for more details on how to write Joi validation schemas.

The validation schemas are defined in the `src/validations` directory and are used in the routes by providing them as parameters to the `validate` middleware.

```javascript
const express = require('express');
const validate = require('../../middlewares/validate');
const userValidation = require('../../validations/user.validation');
const userController = require('../../controllers/user.controller');

const router = express.Router();

router.route('/import-data').post(validate(importPOIDataValidator.body), importPOIData);

```

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
const logger = require('<path to src>/config/logger');

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.


