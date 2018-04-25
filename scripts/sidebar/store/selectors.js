import { get } from "lodash";

export function isServiceReady(state, service) {
  // return state.services.service ? state.services.service.ready : undefined;
  return get(state.services, [service, "ready"]);
}
