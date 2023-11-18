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
