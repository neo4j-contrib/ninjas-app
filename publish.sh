#!/bin/bash

export AWS_PROFILE="devrel-team"
yarn build && aws s3 cp build/ s3://ninjas.neo4j.com --recursive --acl public-read

