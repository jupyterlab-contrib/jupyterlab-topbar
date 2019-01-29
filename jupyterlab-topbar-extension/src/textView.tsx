import React from 'react';

import {
  VDomRenderer,
} from '@jupyterlab/apputils';


export class TextView extends VDomRenderer<any> {
    constructor(text: string) {
        super();
        this._text = text;
    }

    protected render(): React.ReactElement<any> {
      return (
        <div className="jp-TopBarItem">{this._text}</div>
      );
    }

    private _text: string;
}

