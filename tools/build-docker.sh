#!/usr/bin/env bash

docker build . -t tonni_mutai/rochambeau

echo 'docker image built ...'

docker run --rm -p 8000:8000 -e NODE_ENV='production' tonni_mutai/rochambeau
