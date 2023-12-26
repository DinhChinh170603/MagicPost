import { EE_ROLE, EM_ROLE, GE_ROLE, GM_ROLE, LEADER_ROLE } from "./constants";

export const sortByString = (key: string) => {
  return (a: any, b: any) => {
    return a[key].localeCompare(b[key]);
  };
};

export const sortByNumber = (key: string) => {
  return (a: any, b: any) => {
    return a[key] - b[key];
  };
};

type RoleValueMap = {
  [key: string]: string;
};

export const roleValueMap: RoleValueMap = {
  LEADER: "leader",
  EXCHANGE_EMPLOYEE: "ex-employee",
  GATHER_EMPLOYEE: "gth-employee",
  EXCHANGE_MANAGER: "ex-manager",
  GATHER_MANAGER: "gth-manager",
};

export const roleNormalize = new Map<string, string>([
  [LEADER_ROLE, "Leader"],
  [EE_ROLE, "Exchange Employee"],
  [GE_ROLE, "Gather Employee"],
  [EM_ROLE, "Exchange Manager"],
  [GM_ROLE, "Gather Manager"],
]);
