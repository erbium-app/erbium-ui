#!/bin/sh
set -eu

repository=$(CDPATH='' cd -- "$(dirname -- "$0")/../../.." && pwd)
shallow=$(git -C "$repository" rev-parse --is-shallow-repository)

if [ "$shallow" = true ]; then
  commit=$(git -C "$repository" rev-parse HEAD)
  git -C "$repository" fetch --unshallow --no-tags origin "$commit"
fi
