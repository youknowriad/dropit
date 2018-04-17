import "./style.scss";

import { Fragment } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";

import Sidebar from "./components/sidebar";
import MenuItem from "./components/menu-item";

const SplashPlugin = () => (
  <Fragment>
    <Sidebar />
    <MenuItem />
  </Fragment>
);

registerPlugin("splash", {
  render: SplashPlugin
});
