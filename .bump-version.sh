bump_build_version
bump_sync_version package.json 's/"version": "[0-9.-]\+"/"version": "'$(cat .release-version)'"/'
