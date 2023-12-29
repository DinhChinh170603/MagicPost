import { createContext } from "react";

const AuthContext = createContext({
  user: null,
  setUser: (user: any) => {
    if (user) {
      // empty block
    }
  },
});

export default AuthContext;
