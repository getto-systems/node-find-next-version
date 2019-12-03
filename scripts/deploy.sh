#!/bin/bash

deploy_main(){
  local version
  local domain

  version=$(cat .release-version)
  domain=trellis.getto.systems/node/find-next-version

  deploy_to $domain
}
deploy_to(){
  local target
  target=$1; shift

  npm build && \
  aws s3 cp \
    --acl private \
    --cache-control "public, max-age=31536000" \
    --recursive \
    dist s3://$target/$version
}

deploy_main
