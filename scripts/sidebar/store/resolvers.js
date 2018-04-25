import apiRequest from "@wordpress/apiRequest";

import { initServices as initServicesAction } from "./actions";

async function* initServices() {
  const services = await apiRequest({ path: "/dropit/v1/services" });
  yield initServicesAction(services);
}
initServices.isFulfilled = state => !!state.services;

export const isServiceReady = initServices;
