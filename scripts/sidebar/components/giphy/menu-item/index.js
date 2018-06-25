import { PluginSidebarMoreMenuItem } from "@wordpress/editPost";
import { __ } from "@wordpress/i18n";

import Icon from "../../icon";

const MenuItem = () => (
  <PluginSidebarMoreMenuItem
    icon={<Icon borderless color="giphy" />}
    target="dropit-giphy-sidebar"
  >
    {__("GIFs from Giphy.com", "dropit")}
  </PluginSidebarMoreMenuItem>
);

export default MenuItem;
