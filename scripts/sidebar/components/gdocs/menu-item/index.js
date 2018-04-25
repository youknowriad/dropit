import { PluginSidebarMoreMenuItem } from "@wordpress/editPost";
import { __ } from "@wordpress/i18n";

const MenuItem = () => (
  <PluginSidebarMoreMenuItem icon="media-document" target="gdrive-sidebar">
    {__("Content from Google Drive", "dropit")}
  </PluginSidebarMoreMenuItem>
);

export default MenuItem;
