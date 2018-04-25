import { PluginSidebar } from "@wordpress/editPost";

import PhotoList from "../photo-list";

const Sidebar = () => (
  <PluginSidebar name="dropit-sidebar" title="Drop it: Unsplash.com">
    <PhotoList />
  </PluginSidebar>
);

export default Sidebar;
