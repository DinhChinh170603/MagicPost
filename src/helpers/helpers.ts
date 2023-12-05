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
}

export const roleValueMap: RoleValueMap = {
  LEADER: "leader",
  EXCHANGE_EMPLOYEE: "ex-employee",
  GATHER_EMPLOYEE: "gth-employee",
  EXCHANGE_MANAGER: "ex-manager",
  GATHER_MANAGER: "gth-manager",
};
