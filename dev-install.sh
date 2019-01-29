#!/usr/bin/env bash

echo -n "Checking yarn... "
yarn -v
pip --version
jupyter lab --version 2>/dev/null

# All following commands must run successfully
set -e

echo -n "Installing and building all yarn packages"
yarn install
yarn run build

jupyter labextension link ./packages/jupyterlab-topbar
jupyter labextension link ./packages/jupyterlab-topbar-extension
