"use client";

import { createContext, useContext, useState } from "react";

interface NavCtxProps {
  RightMenu: any;
  setRightMenu: React.Dispatch<
    React.SetStateAction<React.ComponentType<any> | null>
  >;
  refreshMenu: any;
  setRefreshMenu: any;
}

const NavCtx = createContext({} as NavCtxProps);

export const NavCtxProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const [RightMenu, setRightMenu] = useState<React.ComponentType<any> | null>(
    null
  );
  const [refreshMenu, setRefreshMenu] = useState(false);

  const value = {
    RightMenu: RightMenu,
    setRightMenu: setRightMenu,
    refreshMenu: refreshMenu,
    setRefreshMenu: setRefreshMenu
  };

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
};

export function useNavContext() {
  return useContext(NavCtx);
}
