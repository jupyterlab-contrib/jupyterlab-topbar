import '../style/index.css';

import { Token } from '@phosphor/coreutils';
import { Widget } from '@phosphor/widgets';

export const ITopBar = new Token<ITopBar>('jupyterlab-topbar:ITopBar');

export interface ITopBar {
    addItem(item: Widget): void;
}

export class TopBar extends Widget implements ITopBar {
    addItem(item: Widget) {
        console.log("Add an item");
    }
}
