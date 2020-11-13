import { Toolbar } from '@jupyterlab/apputils';

import { ArrayExt, every, map, toArray, each } from '@lumino/algorithm';

import { Token, MimeData } from '@lumino/coreutils';

import { ElementExt } from '@lumino/domutils';

import { IDragEvent, Drag } from '@lumino/dragdrop';

import { Message } from '@lumino/messaging';

import { Signal, ISignal } from '@lumino/signaling';

import { Widget, PanelLayout } from '@lumino/widgets';

import '../style/index.css';

const CONTENTS_MIME = 'application/x-jupyterlab-topbar';

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
    this._changed = new Signal<TopBar, string[]>(this);
  }

  get changed(): ISignal<TopBar, string[]> {
    return this._changed;
  }

  addItem(name: string, item: Widget): boolean {
    item.addClass(CONTENT_CLASS);
    return super.addItem(name, item);
  }

  setOrder(order: string[]): void {
    const layout = this.layout as PanelLayout;
    const mapping: { [key: string]: Widget } = {};
    each(this.names(), (name, i) => {
      mapping[name] = layout.widgets[i];
    });
    // re-add items in order
    order.forEach((name, pos) => {
      if (!mapping[name]) {
        return;
      }
      layout.insertWidget(pos, mapping[name]);
    });
  }

  protected onAfterAttach(msg: Message): void {
    super.onAfterAttach(msg);
    const node = this.node;
    node.addEventListener('mousedown', this, true);
    node.addEventListener('mousedown', this);
    node.addEventListener('p-dragenter', this);
    node.addEventListener('p-dragleave', this);
    node.addEventListener('p-dragover', this);
    node.addEventListener('p-drop', this);
  }

  protected onBeforeDetach(msg: Message): void {
    const node = this.node;
    node.removeEventListener('mousedown', this, true);
    node.removeEventListener('mousedown', this);
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
    const index = Private.hitTestNodes(
      this.node.children,
      event.clientX,
      event.clientY
    );
    if (index === -1) {
      return;
    }

    if (event.button !== 0) {
      return;
    }

    event.preventDefault();

    this._dragData = {
      pressX: event.clientX,
      pressY: event.clientY,
      index: index,
    };
    document.addEventListener('mouseup', this, true);
    document.addEventListener('mousemove', this, true);
  }

  private _evtMouseup(event: MouseEvent): void {
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

    if (this._drag || !this._dragData) {
      return;
    }

    const data = this._dragData;
    const dx = Math.abs(event.clientX - data.pressX);
    const dy = Math.abs(event.clientY - data.pressY);
    if (dx < DRAG_THRESHOLD && dy < DRAG_THRESHOLD) {
      return;
    }

    this._startDrag(data.index, event.clientX, event.clientY);
  }

  private _evtDragEnter(event: IDragEvent): void {
    if (!event.mimeData.hasData(CONTENTS_MIME)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const target = event.target as HTMLElement;
    const index = Private.findWidget(this.node.children, target);
    if (index === -1) {
      return;
    }

    const widget = (this.layout as PanelLayout).widgets[index];
    widget.node.classList.add(DROP_TARGET_CLASS);
  }

  private _evtDragLeave(event: IDragEvent): void {
    if (!event.mimeData.hasData(CONTENTS_MIME)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
  }

  private _evtDragOver(event: IDragEvent): void {
    if (!event.mimeData.hasData(CONTENTS_MIME)) {
      return;
    }
    event.preventDefault();
    event.stopPropagation();
    event.dropAction = event.proposedAction;
    const elements = this.node.getElementsByClassName(DROP_TARGET_CLASS);
    if (elements.length) {
      (elements[0] as HTMLElement).classList.remove(DROP_TARGET_CLASS);
    }
    const target = this._findRootItem(event.target as HTMLElement);
    const index = Private.findWidget(this.node.children, target);
    if (index === -1) {
      return;
    }
    const widget = (this.layout as PanelLayout).widgets[index];
    widget.node.classList.add(DROP_TARGET_CLASS);
  }

  private _findRootItem(node: HTMLElement): HTMLElement {
    while (node && this.node !== node.parentElement) {
      node = node.parentElement;
    }
    return node;
  }

  private _evtDrop(event: IDragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (event.proposedAction === 'none') {
      event.dropAction = 'none';
      return;
    }
    if (!event.mimeData.hasData(CONTENTS_MIME)) {
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
    const index = Private.findWidget(this.node.children, target);
    if (index === -1) {
      return;
    }

    const prevNames = toArray(this.names());

    const layout = this.layout as PanelLayout;
    const startIndex = this._dragData.index;
    const widget = layout.widgets[startIndex];
    layout.insertWidget(index, widget);

    const newNames = toArray(this.names());
    const equal = every(
      map(newNames, (value, i) => value === prevNames[i]),
      (v) => v
    );
    if (!equal) {
      this._changed.emit(newNames);
    }
  }

  private _startDrag(index: number, clientX: number, clientY: number): void {
    const item = this.node.children[index] as HTMLElement;
    const dragImage = Private.createDragImage(item);

    this._drag = new Drag({
      dragImage,
      mimeData: new MimeData(),
      supportedActions: 'move',
      proposedAction: 'move',
    });

    this._drag.mimeData.setData(CONTENTS_MIME, index);

    document.removeEventListener('mousemove', this, true);
    document.removeEventListener('mouseup', this, true);
    void this._drag.start(clientX, clientY).then((action) => {
      this._drag = null;
    });
  }

  private _drag: Drag | null = null;
  private _dragData: {
    pressX: number;
    pressY: number;
    index: number;
  } | null = null;
  private _changed: Signal<TopBar, string[]>;
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
    return ArrayExt.findFirstIndex(nodes, (node) =>
      ElementExt.hitTest(node, x, y)
    );
  }

  export function findWidget(
    nodes: HTMLCollection,
    target: HTMLElement
  ): number {
    return ArrayExt.findFirstIndex(nodes, (node) => node === target);
  }

  export function createDragImage(node: HTMLElement): HTMLElement {
    const dragImage = node.cloneNode(true) as HTMLElement;
    dragImage.className = DRAG_CONTENT_CLASS;
    if (!node.innerHTML) {
      dragImage.style.width = `${node.clientWidth}px`;
      dragImage.style.height = `${node.clientHeight}px`;
    }
    return dragImage;
  }
}
