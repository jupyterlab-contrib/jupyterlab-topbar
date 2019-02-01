JupyterLab Top Bar
==================

This is a monorepo to experiment with the top bar space in JupyterLab.

Similar to the [status bar](https://github.com/jupyterlab/jupyterlab/tree/master/packages/statusbar-extension), the top bar can be used to place a few indicators and optimize the overall space.

Inspired by Gnome Shell Top Bar indicators.

![screenshot](./doc/screenshot.png)

## Installation

Requires JupyterLab 0.35.4

```bash
jupyter labextension install jupyterlab-topbar-extension
jupyter labextension install jupyterlab-system-monitor
```

## Dev setup

```bash
conda create -n jupyterlab-topbar -c conda-forge python=3.7 nodejs yarn jupyterlab
conda activate jupyterlab-topbar

./dev-install.sh
```
