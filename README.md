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

## Usage

### CRUD API
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

### Installing Dependencies

From within the root directory:

```sh
npm install -g webpack
npm install
```

