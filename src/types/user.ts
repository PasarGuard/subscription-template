export interface ProxySettings {
  vmess?: {
    id: string;
  };
  vless?: {
    id: string;
    flow: string;
  };
  trojan?: {
    password: string;
  };
  shadowsocks?: {
    password: string;
    method: string;
  };
}

export interface NextPlan {
  user_template_id: number;
  data_limit: number;
  expire: number;
  add_remaining_traffic: boolean;
}

export interface UserInfo {
  proxy_settings: ProxySettings;
  expire: string | null;
  data_limit: number;
  data_limit_reset_strategy: string;
  on_hold_expire_duration: number;
  on_hold_timeout: string | null;
  group_ids: number[];
  next_plan: NextPlan | null;
  id: number;
  username: string;
  status: "active" | "disabled" | "limited" | "expired" | "on_hold";
  used_traffic: number;
  lifetime_used_traffic: number;
  created_at: string;
  edit_at: string | null;
  online_at: string | null;
}

export interface ConfigData {
  links: string[];
}

export interface UsageDataPoint {
  total_traffic: number;
  period_start: string;
}

export interface ChartData {
  period: string;
  start: string;
  end: string;
  stats: {
    [key: string]: UsageDataPoint[];
  };
}

export interface AppClient {
  name: string;
  icon_url: string;
  import_url: string;
  description: Record<string, string>;
  recommended: boolean;
  platform: 'ios' | 'android' | 'windows' | 'linux' | string;
  download_links: Array<{ name: string; url: string; language: string }>;
}

