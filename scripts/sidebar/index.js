import "./style.scss";

import { Fragment } from "@wordpress/element";
import { registerPlugin } from "@wordpress/plugins";

import SidebarUnsplash from "./components/unsplash/sidebar";
import SidebarGiphy from "./components/giphy/sidebar";
import MenuItemUnsplash from "./components/unsplash/menu-item";
import MenuItemGiphy from "./components/giphy/menu-item";

const Dropit = () => (
  <Fragment>
    <SidebarUnsplash />
    <MenuItemUnsplash />
    <SidebarGiphy />
    <MenuItemGiphy />
  </Fragment>
);

registerPlugin("dropit", {
  render: Dropit
});
