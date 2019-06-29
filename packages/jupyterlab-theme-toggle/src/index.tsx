import {
  JupyterFrontEnd,
  JupyterFrontEndPlugin
} from "@jupyterlab/application";

import { IThemeManager, ReactWidget } from "@jupyterlab/apputils";

import { ITopBar } from "jupyterlab-topbar";

import * as React from "react";

import { FocusStyleManager } from "@blueprintjs/core";

import {
  Switch as BPSwitch,
  ISwitchProps as IBPSwitchProps
} from "@blueprintjs/core/lib/cjs/components/forms/controls";

import "../style/index.css";

FocusStyleManager.onlyShowFocusOnTabs();

interface ISwitchProps extends IBPSwitchProps {
  title?: string;
  themeManager: IThemeManager;
  dark?: boolean;
}

interface ISwitchState {
  dark: boolean;
}

class Switch extends React.Component<ISwitchProps, ISwitchState> {
  private timeout: number = 0;

  constructor(props: any) {
    super(props);
    this.state = {
      dark: props.dark || false
    };
  }

  componentDidMount() {
    let { themeManager } = this.props;
    if (!themeManager.theme) {
      // TODO: investigate why the themeManager is undefined
      this.timeout = setTimeout(() => {
        this.updateChecked();
      }, 500);
    } else {
      this.updateChecked();
    }
    themeManager.themeChanged.connect(this.updateChecked, this);
  }

  componentWillUnmount() {
    clearTimeout(this.timeout);
    let { themeManager } = this.props;
    themeManager.themeChanged.disconnect(this.updateChecked, this);
  }

  updateChecked = () => {
    let { themeManager } = this.props;
    const isDark = !themeManager.isLight(themeManager.theme);
    this.setState({
      dark: !!isDark
    });
  };

  render() {
    let { themeManager, dark, ...others } = this.props;

    return (
      <BPSwitch
        {...others}
        checked={this.state.dark}
        className={this.props.className + " jp-Switch"}
      />
    );
  }
}

/**
 * Initialization data for the jupyterlab-theme-toggle extension.
 */
const extension: JupyterFrontEndPlugin<void> = {
  id: "jupyterlab-theme-toggle",
  autoStart: true,
  requires: [IThemeManager, ITopBar],
  activate: (
    app: JupyterFrontEnd,
    themeManager: IThemeManager,
    topBar: ITopBar
  ) => {
    // TODO: make this configurable via the settings?
    let themes = [
      "JupyterLab Light", // Light Theme goes first
      "JupyterLab Dark"
    ];

    const onChange = async () => {
      const isLight = themeManager.isLight(themeManager.theme);
      await app.commands.execute("apputils:change-theme", {
        theme: themes[~~isLight]
      });
    };

    let widget = ReactWidget.create(
      <Switch
        themeManager={themeManager}
        onChange={onChange}
        innerLabel="light"
        innerLabelChecked="dark"
      />
    );

    topBar.addItem("theme-toggle", widget);
  }
};

export default extension;
