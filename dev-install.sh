#!/usr/bin/env bash

set -e

python -m pip --version

jupyter lab --version 2>/dev/null
jlpm -v

jlpm install
jlpm run build

jupyter labextension link ./packages/jupyterlab-topbar --no-build
jupyter labextension install ./packages/jupyterlab-topbar-extension \
                             ./packages/jupyterlab-topbar-text
