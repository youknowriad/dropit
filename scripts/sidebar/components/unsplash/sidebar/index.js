import { createElement } from "@wordpress/element";
import { PluginSidebar } from "@wordpress/editPost";

import PhotoList from "../../photo-list";
import Icon from "../../icon";
import { search, all, download } from "../api";

const Sidebar = () => (
  <PluginSidebar
    icon={<Icon borderless color="unsplash" />}
    name="dropit-sidebar"
    title="Powered by Unsplash"
  >
    <PhotoList api={{ search, all, download }} />
  </PluginSidebar>
);

export default Sidebar;
