#!/bin/bash

set -e

MAJOR_VERSION=$(node -e "console.log('v' + require('./package.json').version.split('.')[0])")

echo "Retagging ${MAJOR_VERSION}"
git tag -d ${MAJOR_VERSION} && \
  git push --delete origin ${MAJOR_VERSION} && \
  git tag -a ${MAJOR_VERSION} -m ${NEXT_VERSION} && \
  git push --follow-tags