"use strict";(self.webpackChunk_jupyterlab_theme_toggler_extension=self.webpackChunk_jupyterlab_theme_toggler_extension||[]).push([[789],{1246:(e,t,a)=>{a.d(t,{Z:()=>o});var l=a(9601),s=a.n(l),n=a(2609),c=a.n(n)()(s());c.push([e.id,".jp-Switch {\n  margin-bottom: 0;\n}\n\n.jp-Switch.bp3-control .bp3-control-indicator {\n  margin-right: 0;\n}\n",""]);const o=c},4599:(e,t,a)=>{a.d(t,{Z:()=>i});var l=a(9601),s=a.n(l),n=a(2609),c=a.n(n),o=a(1246),g=c()(s());g.i(o.Z),g.push([e.id,"\n",""]);const i=g},2201:(e,t,a)=>{a.r(t),a.d(t,{default:()=>y});var l=a(6201),s=(a(2608),a(5350)),n=a(2189),c=a(6029),o=a(6062),g=a.n(o),i=a(4036),r=a.n(i),d=a(6793),h=a.n(d),v=a(7892),m=a.n(v),p=a(1173),w=a.n(p),u=a(2464),x=a.n(u),f=a(4599),b={};b.styleTagTransform=x(),b.setAttributes=m(),b.insert=h().bind(null,"head"),b.domAPI=r(),b.insertStyleElement=w(),g()(f.Z,b),f.Z&&f.Z.locals&&f.Z.locals,l.FocusStyleManager.onlyShowFocusOnTabs();const M=e=>{const{themeManager:t,...a}=e,[s,n]=(0,c.useState)(!1);(0,c.useEffect)((()=>{n(!!e.dark)}),[e.dark]);const o=()=>{const e=!t.isLight(t.theme);n(!!e)};return(0,c.useEffect)((()=>{let e=0;return t.theme?o():e=setTimeout((()=>{o()}),500),t.themeChanged.connect(o),()=>{clearTimeout(e),t.themeChanged.disconnect(o)}})),c.createElement(l.Switch,{...a,checked:s,className:e.className+" jp-Switch"})},y={id:"@jupyterlab/theme-toggler-extension:plugin",autoStart:!0,requires:[s.IThemeManager],optional:[s.IToolbarWidgetRegistry],activate:async(e,t,a)=>{console.log("@jupyterlab/theme-toggler-extension is activated!");const{commands:l}=e,s=["JupyterLab Light","JupyterLab Dark"],o=async()=>{const e=t.isLight(t.theme);await l.execute("apputils:change-theme",{theme:s[~~e]})};a&&a.addFactory("TopBar","theme-toggler",(()=>n.ReactWidget.create(c.createElement(M,{themeManager:t,onChange:o,innerLabel:"light",innerLabelChecked:"dark"}))))}}},1002:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cg fill=%27%235f6b7c%27%3e%3cpath d=%27M2 6.03a2 2 0 100 4 2 2 0 100-4zM14 6.03a2 2 0 100 4 2 2 0 100-4zM8 6.03a2 2 0 100 4 2 2 0 100-4z%27/%3e%3c/g%3e%3c/svg%3e"},983:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cg fill=%27%23abb3bf%27%3e%3cpath d=%27M2 6.03a2 2 0 100 4 2 2 0 100-4zM14 6.03a2 2 0 100 4 2 2 0 100-4zM8 6.03a2 2 0 100 4 2 2 0 100-4z%27/%3e%3c/g%3e%3c/svg%3e"},8798:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M10.71 7.29l-4-4a1.003 1.003 0 00-1.42 1.42L8.59 8 5.3 11.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71l4-4c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z%27 fill=%27%235f6b7c%27/%3e%3c/svg%3e"},7802:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M10.71 7.29l-4-4a1.003 1.003 0 00-1.42 1.42L8.59 8 5.3 11.29c-.19.18-.3.43-.3.71a1.003 1.003 0 001.71.71l4-4c.18-.18.29-.43.29-.71 0-.28-.11-.53-.29-.71z%27 fill=%27%23abb3bf%27/%3e%3c/svg%3e"},4966:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M11 7H5c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1z%27 fill=%27%23111418%27/%3e%3c/svg%3e"},3678:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M11 7H5c-.55 0-1 .45-1 1s.45 1 1 1h6c.55 0 1-.45 1-1s-.45-1-1-1z%27 fill=%27white%27/%3e%3c/svg%3e"},8213:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z%27 fill=%27%23111418%27/%3e%3c/svg%3e"},9080:e=>{e.exports="data:image/svg+xml,%3csvg xmlns=%27http://www.w3.org/2000/svg%27 viewBox=%270 0 16 16%27%3e%3cpath fill-rule=%27evenodd%27 clip-rule=%27evenodd%27 d=%27M12 5c-.28 0-.53.11-.71.29L7 9.59l-2.29-2.3a1.003 1.003 0 00-1.42 1.42l3 3c.18.18.43.29.71.29s.53-.11.71-.29l5-5A1.003 1.003 0 0012 5z%27 fill=%27white%27/%3e%3c/svg%3e"}}]);