import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { IToolbarWidgetRegistry } from '@jupyterlab/apputils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { JSONObject } from '@lumino/coreutils';

import { CpuView } from './cpuView';

import { MemoryView } from './memoryView';

import { ResourceUsage } from './model';

import '../style/index.css';

/**
 * Extension ID.
 */
const sysMonitorPluginId = '@jupyterlab/system-monitor-extension:plugin';

/**
 * The default refresh rate.
 */
const DEFAULT_REFRESH_RATE = 5000;

/**
 * The default memory label.
 */
const DEFAULT_MEMORY_LABEL = 'Mem: ';

/**
 * The default CPU label.
 */
const DEFAULT_CPU_LABEL = 'CPU: ';

/**
 * An interface for resource settings.
 */
interface IResourceSettings extends JSONObject {
  label: string;
}

/**
 * Initialization data for the jupyterlab-system-monitor extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: sysMonitorPluginId,
  autoStart: true,
  requires: [IToolbarWidgetRegistry],
  optional: [ISettingRegistry],
  activate: async (
    app: JupyterFrontEnd,
    toolbarRegistry: IToolbarWidgetRegistry,
    settingRegistry: ISettingRegistry
  ) => {
    let refreshRate = DEFAULT_REFRESH_RATE;
    let cpuLabel = DEFAULT_CPU_LABEL;
    let memoryLabel = DEFAULT_MEMORY_LABEL;

    if (settingRegistry) {
      const settings = await settingRegistry.load(extension.id);
      refreshRate = settings.get('refreshRate').composite as number;
      const cpuSettings = settings.get('cpu').composite as IResourceSettings;
      cpuLabel = cpuSettings.label;
      const memorySettings = settings.get('memory')
        .composite as IResourceSettings;
      memoryLabel = memorySettings.label;
    }

    const model = new ResourceUsage.Model({ refreshRate });
    await model.refresh();

    if (model.cpuAvailable) {
      toolbarRegistry.addFactory('TopBar', 'cpu', () => {
        const cpu = CpuView.createCpuView(model, cpuLabel);
        return cpu;
      });
    }

    if (model.memoryAvailable) {
      toolbarRegistry.addFactory('TopBar', 'memory', () => {
        const memory = MemoryView.createMemoryView(model, memoryLabel);
        return memory;
      });
    }
  },
};

export default extension;
