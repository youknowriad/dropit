import { withSelect } from "@wordpress/data";
import { PluginSidebar } from "@wordpress/editPost";
import { __ } from "@wordpress/i18n";
import { Button, PanelBody } from "@wordpress/components";
import { addQueryArgs } from "@wordpress/url";

import DocList from "../doc-list";

const Sidebar = ({ isReady, isKeyringReady }) => {
  if (isReady === undefined) {
    return null;
  }

  return (
    <PluginSidebar name="gdrive-sidebar" title="Drop it: Google Drive">
      <PanelBody>
        {(!isKeyringReady || !isReady) && (
          <p>
            {__(
              "Make sure to install the keyring plugin and enable the Google connection",
              "dropit"
            )}
          </p>
        )}
        {!isKeyringReady && (
          <Button
            isPrimary
            href={addQueryArgs("plugin-install.php", {
              s: "keyring",
              tab: "search",
              type: "term"
            })}
          >
            {__("Install and active Keyring")}
          </Button>
        )}

        {isKeyringReady &&
          !isReady && (
            <Button
              isPrimary
              href={addQueryArgs("tools.php", {
                page: "keyring",
                action: "services"
              })}
            >
              {__("Enable the Google Connection")}
            </Button>
          )}

        {isKeyringReady && isReady && <DocList />}
      </PanelBody>
    </PluginSidebar>
  );
};

export default withSelect(select => ({
  isReady: select("dropit").isServiceReady("keyring"),
  isKeyringReady: select("dropit").isServiceReady("google")
}))(Sidebar);
