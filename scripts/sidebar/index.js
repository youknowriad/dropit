import "./style.scss";

import { Fragment } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";
import {
  PluginSidebar,
  __experimental as experimentalAPI
} from "@wordpress/editPost";

const { PluginMoreMenuItem } = experimentalAPI;

const SplashSidebar = () => (
  <PluginSidebar name="splash-sidebar" title="Splash">
    Welcome to Splash
  </PluginSidebar>
);

const SplashMenuItem = () => (
  <PluginMoreMenuItem
    name="splash-menu-item"
    icon="art"
    type="sidebar"
    target="splash-sidebar"
  >
    Open Splash
  </PluginMoreMenuItem>
);

const SplashPlugin = () => (
  <Fragment>
    <SplashSidebar />
    <SplashMenuItem />
  </Fragment>
);

registerPlugin("splash", {
  render: SplashPlugin
});
