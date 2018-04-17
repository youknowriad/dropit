import { __experimental as experimentalAPI } from "@wordpress/editPost";

const { PluginMoreMenuItem } = experimentalAPI;

const MenuItem = () => (
  <PluginMoreMenuItem
    name="splash-menu-item"
    icon="art"
    type="sidebar"
    target="splash-sidebar"
  >
    Open Splash
  </PluginMoreMenuItem>
);

export default MenuItem;
