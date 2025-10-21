import type { UserInfo, ConfigData, ChartData, AppClient } from "./user";

export interface InitialData {
  user?: UserInfo; // User data as structured object from template
  links?: string[];
  apps?: AppClient[];
}

declare global {
  interface Window {
    __INITIAL_DATA__?: InitialData;
  }
}

export {};
