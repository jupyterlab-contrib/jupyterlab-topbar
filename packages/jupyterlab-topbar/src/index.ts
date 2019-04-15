import { Toolbar } from '@jupyterlab/apputils';

import { ArrayExt } from '@phosphor/algorithm';
import { Token, MimeData } from '@phosphor/coreutils';
import { ElementExt } from '@phosphor/domutils';
import { IDragEvent, Drag } from '@phosphor/dragdrop';
import { Message } from '@phosphor/messaging';
import { Widget, PanelLayout } from '@phosphor/widgets';

import '../style/index.css';

const TOPBAR_CLASS = 'jp-TopBar';
const CONTENT_CLASS = 'jp-TopBar-item';
const DRAG_CONTENT_CLASS = 'jp-TopBar-DragItem';
const DROP_TARGET_CLASS = 'jp-TopBar-DropTarget';
const DRAG_THRESHOLD = 5;

export const ITopBar = new Token<ITopBar>('jupyterlab-topbar:ITopBar');

export interface ITopBar {
  addItem(name: string, item: Widget): boolean;
}

export class TopBar extends Toolbar<Widget> implements ITopBar {
  constructor() {
    super();
    this.addClass(TOPBAR_CLASS);
  }

  addItem(name: string, item: Widget): boolean {
    item.addClass(CONTENT_CLASS);
    return super.addItem(name, item);
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    let node = this.node;
    node.addEventListener('contextmenu', this, true);
    node.addEventListener('mousedown', this, true);
    node.addEventListener('mousedown', this);
    node.addEventListener('dblclick', this);
    node.addEventListener('p-dragenter', this);
    node.addEventListener('p-dragleave', this);
    node.addEventListener('p-dragover', this);
    node.addEventListener('p-drop', this);
  }

  protected onBeforeDetach(msg: Message): void {
    let node = this.node;
    node.removeEventListener('contextmenu', this, true);
    node.removeEventListener('mousedown', this, true);
    node.removeEventListener('mousedown', this);
    node.removeEventListener('keydown', this);
    node.removeEventListener('dblclick', this);
    node.removeEventListener('p-dragenter', this);
    node.removeEventListener('p-dragleave', this);
    node.removeEventListener('p-dragover', this);
    node.removeEventListener('p-drop', this);
    document.removeEventListener('mousemove', this, true);
    document.removeEventListener('mouseup', this, true);
  }

  handleEvent(event: Event): void {
    switch (event.type) {
      case 'mousedown':
        this._evtMousedown(event as MouseEvent);
        break;
      case 'mouseup':
        this._evtMouseup(event as MouseEvent);
        break;
      case 'mousemove':
        this._evtMousemove(event as MouseEvent);
        break;
      case 'p-dragenter':
        this._evtDragEnter(event as IDragEvent);
        break;
      case 'p-dragleave':
        this._evtDragLeave(event as IDragEvent);
        break;
      case 'p-dragover':
        this._evtDragOver(event as IDragEvent);
        break;
      case 'p-drop':
        this._evtDrop(event as IDragEvent);
        break;
      default:
        break;
    }
  }

  private _evtMousedown(event: MouseEvent): void {
    let index = Private.hitTestNodes(this.node.children, event.clientX, event.clientY);
    if (index === -1) {
      return;
    }

    // Left mouse press for drag start.
    if (event.button === 0) {
      this._dragData = {
        pressX: event.clientX,
        pressY: event.clientY,
        index: index
      };
      document.addEventListener('mouseup', this, true);
      document.addEventListener('mousemove', this, true);
    }
  }

  private _evtMouseup(event: MouseEvent): void {
    // Remove the drag listeners if necessary.
    if (event.button !== 0 || !this._drag) {
      document.removeEventListener('mousemove', this, true);
      document.removeEventListener('mouseup', this, true);
      return;
    }
    event.preventDefault();
    event.stopPropagation();
  }

  private _evtMousemove(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();

    // Bail if we are the one dragging.
    if (this._drag || !this._dragData) {
      return;
    }

    // Check for a drag initialization.
    let data = this._dragData;
    let dx = Math.abs(event.clientX - data.pressX);
    let dy = Math.abs(event.clientY - data.pressY);
    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
      return;
    }

    this._startDrag(data.index, event.clientX, event.clientY);
  }


  private _evtDragEnter(event: IDragEvent): void {
    // if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
    //   return;
    // }
    event.preventDefault();
    event.stopPropagation();
    let target = event.target as HTMLElement;
    let index = Private.findWidget(this.node.children, target);
    if (index === -1) {
      return;
    }

    let widget = (this.layout as PanelLayout).widgets[index];
    widget.node.classList.add(DROP_TARGET_CLASS);
  }

  private _evtDragLeave(event: IDragEvent): void {
    // if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
    //   return;
    // }
    event.preventDefault();
    event.stopPropagation();
    let elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
  }

  private _evtDragOver(event: IDragEvent): void {
    // if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
    //   return;
    // }
    event.preventDefault();
    event.stopPropagation();
    event.dropAction = event.proposedAction;
    let elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
    let target = event.target as HTMLElement;
    let index = Private.findWidget(this.node.children, target);
    if (index === -1) {
      return;
    }
    let widget = (this.layout as PanelLayout).widgets[index];
    widget.node.classList.add(DROP_TARGET_CLASS);
  }

  private _evtDrop(event: IDragEvent): void {
    // if (!event.mimeData.hasData(JUPYTER_CELL_MIME)) {
    //   return;
    // }
    event.preventDefault();
    event.stopPropagation();
    if (event.proposedAction === 'none') {
      event.dropAction = 'none';
      return;
    }

    let target = event.target as HTMLElement;
    while (target && target.parentElement) {
      if (target.classList.contains(DROP_TARGET_CLASS)) {
        target.classList.remove(DROP_TARGET_CLASS);
        break;
      }
      target = target.parentElement;
    }
    let index = Private.findWidget(this.node.children, target);
    if (index === -1) {
      return;
    }

    const layout = this.layout as PanelLayout;
    const result: any = Array.from(layout.widgets);
    const startIndex = this._dragData.index;
    const endIndex = index;
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    layout.removeWidgetAt(startIndex);
    layout.insertWidget(index, removed);
  }

  private _startDrag(index: number, clientX: number, clientY: number): void {
    // Create the drag image.
    const item = this.node.children[index] as HTMLElement;
    let dragImage = Private.createDragImage(item);

    // Set up the drag event.
    this._drag = new Drag({
      dragImage,
      mimeData: new MimeData(),
      supportedActions: 'move',
      proposedAction: 'move'
    });
    // Start the drag and remove the mousemove and mouseup listeners.
    document.removeEventListener('mousemove', this, true);
    document.removeEventListener('mouseup', this, true);
    void this._drag.start(clientX, clientY).then(action => {
      this._drag = null;
    });
  }

  private _drag: Drag | null = null;
  private _dragData: {
    pressX: number;
    pressY: number;
    index: number;
  } | null = null;

}

export namespace TopBar {
  export function createSpacerItem(): Widget {
    return Toolbar.createSpacerItem();
  }
}

namespace Private {

  export function hitTestNodes(
    nodes: HTMLCollection,
    x: number,
    y: number
  ): number {
    return ArrayExt.findFirstIndex(nodes, node =>
      ElementExt.hitTest(node, x, y)
    );
  }

  export function findWidget(
    nodes: HTMLCollection,
    target: HTMLElement,
  ): number {
    return ArrayExt.findFirstIndex(nodes, node => node === target);
  }

  export function createDragImage(
    node: HTMLElement,
  ): HTMLElement {
      let dragImage = node.cloneNode(true) as HTMLElement;
      dragImage.className = DRAG_CONTENT_CLASS;
      return dragImage;
  }
}
