# ROCHAMBEAU

[ROCHAMBEAU](https://bit.ly/3rvU71t)


## Architecture and Design

Game API is built with expressJS in a simplified layout microservice repo structure.

## How to run

Dockerized application is using latest node slim.

Build and Run it with from repo root

```
$ ./tools/build-docker.sh
```


You can use a client like postman to test out the REST API.

For the cli app, please make sure to generate an access token by logging in via the api.
Export it to the your environment as such `export ROCHAMBEAU_ACCESS_TOKEN=xxxxxxxxxx`. Build the project to use the dist version of the app by running `$ npm run build`

1. Run it from the repo via `$ npm run cli` or
2. Run `$ npm link` to have access to it via cli then run it as `$ rochambeau`


## Architecture and Design 

### API

RESTFul API is accessible via `/v1`. 

### Swagger Docs

API Documentation is available in `http://localhost:8000/docs`.

### CLI App

## Improvements

- Use streaming to play in realtime
- data validation(Schemas)
- ...
