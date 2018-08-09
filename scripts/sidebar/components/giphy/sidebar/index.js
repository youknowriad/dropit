import { createElement } from "@wordpress/element";
import { PluginSidebar } from "@wordpress/editPost";

import PhotoList from "../../photo-list";
import Icon from "../../icon";
import { search, all } from "../api";

const Sidebar = () => (
  <PluginSidebar
    icon={<Icon borderless color="giphy" />}
    name="dropit-giphy-sidebar"
    title="Powered By GIPHY"
  >
    <PhotoList api={{ search, all }} />
  </PluginSidebar>
);

export default Sidebar;
