# Project Name

> Project description

## Related Projects

  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo
  - https://github.com/teamName/repo

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)

## Database
Running server/db/generate_data.js will create dummy data in .csv format to be imported into the database. Global constants for the number of records for each data input can be set at the top of the file.

DBs used for this project are Postgres and Cassandra.

## CRUD API
To create a new user in the database:
send POST request to domain/api/users with the user name in the body of the request with the name field (name: username)

To find a specific user by name:
send GET request to domain/api/users/username

To update a user avatar:
send PUT request to domain/api/users with the user name in the body of the request with the name field (name: username)
This assigns a random image to the user

To delete all reviews for a property listing:
send DELETE request to domain/api/rentals/id where id is the number id of the listing

## Requirements

## Development
To stress test an api route: npm run bombard
Each request type (GET, POST) in the the test/art_stress.yml file can be commented out to test one at a time, or uncomment all to run both concurrently.

### Installing Dependencies

From within the root directory:

Database

```sh
npm i pg pg-hstore sequelize

```

For data mocking:
```sh
npm i faker moment
```

for api/db stress testing:
```sh
npm i artillery
```
