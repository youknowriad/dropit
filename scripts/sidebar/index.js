import "./style.scss";

import { Fragment, createElement } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";

import SidebarUnsplash from "./components/unsplash/sidebar";
import SidebarGiphy from "./components/giphy/sidebar";
import MenuItemUnsplash from "./components/unsplash/menu-item";
import MenuItemGiphy from "./components/giphy/menu-item";
import { isActiveSidebar } from "./components/utils";

const Dropit = () => (
  <Fragment>
  { isActiveSidebar('unsplash') && (
    <Fragment>
      <SidebarUnsplash />
      <MenuItemUnsplash />
    </Fragment>
    ) }
  { isActiveSidebar('giphy') && (
    <Fragment>
      <SidebarGiphy />
      <MenuItemGiphy />
    </Fragment>
  ) }
  </Fragment>
);

registerPlugin("dropit", {
  render: Dropit
});
