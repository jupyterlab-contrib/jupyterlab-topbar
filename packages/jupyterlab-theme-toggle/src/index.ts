import {
  JupyterFrontEnd, JupyterFrontEndPlugin
} from '@jupyterlab/application';

import '../style/index.css';


/**
 * Initialization data for the jupyterlab-theme-toggle extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-theme-toggle',
  autoStart: true,
  activate: (app: JupyterFrontEnd) => {
    console.log('JupyterLab extension jupyterlab-theme-toggle is activated!');
  }
};

export default extension;
