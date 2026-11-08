import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
  IRouter,
} from '@jupyterlab/application';

import { PageConfig, URLExt } from '@jupyterlab/coreutils';

import '@jupyterlab/application/style/buttons.css';

import '../style/index.css';

const logoutPluginId = 'jupyterlab-logout:plugin';

const extension: JupyterFrontEndPlugin<void> = {
  id: logoutPluginId,
  autoStart: true,
  optional: [IRouter],
  activate: async (
    app: JupyterFrontEnd,
    router: IRouter | null
  ): Promise<void> => {
    console.log('jupyterlab-logout extension is activated!');

    // Get app commands
    const { commands } = app;

    const namespace = 'jupyterlab-topbar';
    const command = namespace + ':logout';

    commands.addCommand(command, {
      label: 'Log Out',
      execute: async (args: any) => {
        if (commands.hasCommand('hub:logout')) {
          await commands.execute('hub:logout');
          return;
        }

        const logoutUrl =
          PageConfig.getOption('logoutUrl') ||
          URLExt.join(PageConfig.getBaseUrl(), 'logout');

        window.location.href = logoutUrl;
      },
    });
  },
};

export default extension;
