import { version as vueVersion } from "vue";
import { name as appName, version as appVersion } from "../../package.json";
import { packages } from "../../package-lock.json";

const piniaVersion: string = packages["node_modules/pinia"].version;
const vueRouterVersion: string = packages["node_modules/vue-router"].version;

export { appName, appVersion, piniaVersion, vueRouterVersion, vueVersion };

// export const vueVersion: string = "";
// export const appVersion: string = "";
// export const piniaVersion: string = "";
