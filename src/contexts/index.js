import React from "react";
import { UserProvider } from "./user";

export default function ContextProvider({ children }) {
  return <UserProvider>{children}</UserProvider>;
}
