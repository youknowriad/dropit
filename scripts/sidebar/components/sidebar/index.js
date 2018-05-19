import { PluginSidebar } from "@wordpress/editPost";

import PhotoList from "../photo-list";
import Icon from "../icon";

const Sidebar = () => (
  <PluginSidebar
    icon={<Icon borderless />}
    name="dropit-sidebar"
    title="Drop it: Unsplash.com"
  >
    <PhotoList />
  </PluginSidebar>
);

export default Sidebar;
