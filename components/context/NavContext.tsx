"use client";

import { usePathname } from "next/navigation";
import { createContext, useContext, useEffect, useRef, useState } from "react";

interface NavCtxProps {
  RightMenu: any;
  setRightMenu: React.Dispatch<
    React.SetStateAction<React.ComponentType<any> | null>
  >;
  editable: boolean;
  setEditable: any;
  data: any;
}

const NavCtx = createContext({} as NavCtxProps);

export const NavCtxProvider: React.FC<{ children: React.ReactNode }> = ({
  children
}) => {
  const data = useRef<any>({ layout: null, graphs: null });
  const [editable, setEditable] = useState(false);
  const pathname = usePathname();

  const [RightMenu, setRightMenu] = useState<React.ComponentType<any> | null>(
    null
  );

  useEffect(() => {
    if (RightMenu) {
      setRightMenu(null);
      setEditable(false);
      data.current.layout = null;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const value = {
    RightMenu,
    setRightMenu,
    editable,
    setEditable,
    data
  };

  return <NavCtx.Provider value={value}>{children}</NavCtx.Provider>;
};

export function useNavContext() {
  return useContext(NavCtx);
}
