import { PluginSidebarMoreMenuItem } from "@wordpress/editPost";
import { __ } from "@wordpress/i18n";

const MenuItem = () => (
  <PluginSidebarMoreMenuItem icon="art" target="dropit-sidebar">
    {__("Photos from Unsplash.com", "dropit")}
  </PluginSidebarMoreMenuItem>
);

export default MenuItem;