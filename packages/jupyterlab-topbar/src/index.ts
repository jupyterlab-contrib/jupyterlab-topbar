import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

import { Toolbar } from '@jupyterlab/apputils';

import '../style/index.css';

export const ITopBar = new Token<ITopBar>('jupyterlab-topbar:ITopBar');

export interface ITopBar {
    addItem(name: string, item: Widget): boolean;
}

export class TopBar extends Toolbar<Widget> implements ITopBar {

}

export namespace TopBar {
  export function createSpacerItem(): Widget {
    return Toolbar.createSpacerItem();
  }
}
