import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter,
} from '@jupyterlab/application';

import '@jupyterlab/application/style/buttons.css';

import '../style/index.css';

const logoutPluginId = '@jupyterlab/logout-extension:plugin';

const extension: JupyterFrontEndPlugin<void> = {
  id: logoutPluginId,
  autoStart: true,
  requires: [IRouter],
  activate: async (app: JupyterFrontEnd, router: IRouter): Promise<void> => {
    console.log('@jupyterlab/logout-extension is activated!');

    // Get app commands
    const { commands } = app;

    const namespace = 'topbarcmds';
    const command = namespace + ':logout';

    commands.addCommand(command, {
      label: 'Log Out',
      execute: (args: any) => {
        router.navigate('/logout', { hard: true });
      },
    });
  },
};

export default extension;
