#!/usr/bin/env bash

set -e

yarn -v
pip --version
jupyter lab --version 2>/dev/null

yarn install
yarn run build

jupyter labextension link ./packages/jupyterlab-topbar --no-build
jupyter labextension install ./packages/jupyterlab-topbar-extension
jupyter labextension install ./packages/jupyterlab-system-monitor
