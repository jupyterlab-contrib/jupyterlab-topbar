import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin,
} from '@jupyterlab/application';

import { Dialog, ICommandPalette, showDialog } from '@jupyterlab/apputils';

import { PathExt } from '@jupyterlab/coreutils';

import { ISettingRegistry } from '@jupyterlab/settingregistry';

import { Widget } from '@lumino/widgets';

import { ITopBar } from 'jupyterlab-topbar';

import '../style/index.css';

const TOPBAR_TEXT = 'jp-TopBar-Text';

namespace CommandIDs {
  /**
   * Edit TopBar Text
   */
  export const editText = 'jupyterlab-topbar-text:edit-text';
}

/**
 * Initialization data for the jupyterlab-topbar-text extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: 'jupyterlab-topbar-text:plugin',
  autoStart: true,
  requires: [ICommandPalette, ISettingRegistry, ITopBar],
  activate: async (
    app: JupyterFrontEnd,
    palette: ICommandPalette,
    settingsRegistry: ISettingRegistry,
    topBar: ITopBar
  ) => {
    const settings = await settingsRegistry.load(extension.id);
    let text = settings.get('text').composite as string;
    let editable = settings.get('editable').composite as boolean;
    const textNode = document.createElement('div');
    textNode.textContent = text;
    const textWidget = new Widget({ node: textNode });

    textWidget.addClass(TOPBAR_TEXT);
    topBar.addItem('custom-text', textWidget);

    function showUpdateTextDialog() {
      const oldText = settings.get('text').composite as string;
      showDialog({
        title: 'Edit Top Bar Text',
        body: new EditHandler(oldText),
        buttons: [Dialog.cancelButton(), Dialog.okButton({ label: 'Save' })],
      }).then((result) => {
        if (!result.button.accept) {
          return;
        }
        const text = result.value;
        if (text === null) {
          return;
        }
        settingsRegistry.set(extension.id, 'text', text);
        textNode.textContent = text;
      });
    }

    app.contextMenu.addItem({
      command: CommandIDs.editText,
      selector: `.${TOPBAR_TEXT}`,
      rank: 1,
    });

    app.commands.addCommand(CommandIDs.editText, {
      label: 'Edit Text',
      execute: (args: any) => {
        showUpdateTextDialog();
      },
      isEnabled: () => editable,
    });

    if (palette) {
      const category = 'Top Bar';
      palette.addItem({ command: CommandIDs.editText, category });
    }

    app.restored.then(() => {
      settings.changed.connect(async () => {
        text = settings.get('text').composite as string;
        editable = settings.get('editable').composite as boolean;
        textNode.textContent = text;
      });
    });
  },
};

class EditHandler extends Widget {
  constructor(oldPath: string) {
    super({ node: Private.createEditNode(oldPath) });
    const ext = PathExt.extname(oldPath);
    const value = (this.inputNode.value = PathExt.basename(oldPath));
    this.inputNode.setSelectionRange(0, value.length - ext.length);
  }

  get inputNode(): HTMLInputElement {
    return this.node.getElementsByTagName('input')[0] as HTMLInputElement;
  }

  getValue(): string {
    return this.inputNode.value;
  }
}

namespace Private {
  export function createEditNode(oldText: string): HTMLElement {
    const body = document.createElement('div');
    const existingLabel = document.createElement('label');
    existingLabel.textContent = 'Old Text';
    const existingPath = document.createElement('span');
    existingPath.textContent = oldText;

    const nameTitle = document.createElement('label');
    nameTitle.textContent = 'New Text';
    const name = document.createElement('input');

    body.appendChild(existingLabel);
    body.appendChild(existingPath);
    body.appendChild(nameTitle);
    body.appendChild(name);
    return body;
  }
}

export default extension;
