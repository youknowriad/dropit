import { Fragment } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";

import "./style.scss";
import "./store";
import UnsplashSidebar from "./components/unsplash/sidebar";
import UnsplashMenuItem from "./components/unsplash/menu-item";
import GdocsSidebar from "./components/gdocs/sidebar";
import GdocsMenuItem from "./components/gdocs/menu-item";

const DropitPlugin = () => (
  <Fragment>
    <UnsplashSidebar />
    <UnsplashMenuItem />
    <GdocsSidebar />
    <GdocsMenuItem />
  </Fragment>
);

registerPlugin("dropit", {
  render: DropitPlugin
});
