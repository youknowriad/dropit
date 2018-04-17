import { PluginSidebar } from "@wordpress/editPost";

import PhotoList from "../photo-list";

const Sidebar = () => (
  <PluginSidebar name="splash-sidebar" title="Splash">
    <PhotoList />
  </PluginSidebar>
);

export default Sidebar;
