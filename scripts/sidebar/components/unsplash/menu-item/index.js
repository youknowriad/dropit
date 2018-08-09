import { createElement } from "@wordpress/element";
import { PluginSidebarMoreMenuItem } from "@wordpress/editPost";
import { __ } from "@wordpress/i18n";

import Icon from "../../icon";

const MenuItem = () => (
  <PluginSidebarMoreMenuItem
    icon={<Icon borderless color="unsplash" />}
    target="dropit-sidebar"
  >
    {__("Photos from Unsplash.com", "dropit")}
  </PluginSidebarMoreMenuItem>
);

export default MenuItem;
