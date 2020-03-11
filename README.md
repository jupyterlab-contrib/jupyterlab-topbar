JupyterLab Top Bar
==================

![Github Actions Status](https://github.com/jtpio/jupyterlab-topbar/workflows/Build/badge.svg)
[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jtpio/jupyterlab-topbar/stable?urlpath=lab)

Monorepo to experiment with the top bar space in JupyterLab.

Similar to the [status bar](https://github.com/jupyterlab/jupyterlab/tree/master/packages/statusbar-extension), the top bar can be used to place a few indicators and optimize the overall space.

Inspired by Gnome Shell Top Bar indicators.

![screencast](./doc/screencast.gif)

### Extensions

- [jupyterlab-topbar-extension](./packages/jupyterlab-topbar-extension): generic extension to expose the top bar area
- [jupyterlab-topbar-text](./packages/jupyterlab-topbar-text): add and edit custom text
- [jupyterlab-system-monitor](https://github.com/jtpio/jupyterlab-system-monitor): show system metrics (memory usage)
- [jupyterlab-logout](https://github.com/jtpio/jupyterlab-logout): add a "Log Out" button
- [jupyterlab-theme-toggle](https://github.com/jtpio/jupyterlab-theme-toggle): switch between the Light and Dark themes

## Try it online

Try the extensions in your browser with Binder:

[![Binder](https://mybinder.org/badge_logo.svg)](https://mybinder.org/v2/gh/jtpio/jupyterlab-topbar/stable?urlpath=lab)

## Installation

Requires JupyterLab 1.0+

To install the extensions:

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

# theme toggling extension
jupyter labextension install jupyterlab-theme-toggle
```

All-in-one install:

```bash
jupyter labextension install jupyterlab-topbar-extension \
                             jupyterlab-system-monitor \
                             jupyterlab-topbar-text \
                             jupyterlab-logout \
                             jupyterlab-theme-toggle
```


## Development

```bash
conda env create
conda activate jupyterlab-topbar

./dev-install.sh
```
