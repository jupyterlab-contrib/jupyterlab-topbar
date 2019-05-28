JupyterLab Top Bar
==================

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jtpio/jupyterlab-topbar/stable?urlpath=lab)

Monorepo to experiment with the top bar space in JupyterLab.

Similar to the [status bar](https://github.com/jupyterlab/jupyterlab/tree/master/packages/statusbar-extension), the top bar can be used to place a few indicators and optimize the overall space.

Inspired by Gnome Shell Top Bar indicators.

![screencast](./doc/screencast.gif)

### Extensions

- [jupyterlab-topbar-extension](./packages/jupyterlab-topbar-extension): generic extension to expose the top bar area
- [jupyterlab-topbar-text](./packages/jupyterlab-topbar-text): add and edit custom text
- [jupyterlab-system-monitor](./packages/jupyterlab-system-monitor): show system metrics (memory usage)
- [jupyterlab-logout](./packages/jupyterlab-logout): add a "Log Out" button

## Try it online

Try the extensions in your browser with Binder:

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jtpio/jupyterlab-topbar/stable?urlpath=lab)

## Installation

Requires JupyterLab 0.35.4

```bash
# container extension
jupyter labextension install jupyterlab-topbar-extension

# system metrics
jupyter labextension install jupyterlab-system-monitor
pip install nbresuse

# custom text in the top bar
jupyter labextension install jupyterlab-topbar-text

# add a logout button
jupyter labextension install jupyterlab-logout
```

## Development

Current development is targeting JupyterLab 1.0.

```bash
conda env create
conda activate jupyterlab-topbar
# JupyterLab pre-release
python -m pip install jupyterlab --pre

./dev-install.sh
```
