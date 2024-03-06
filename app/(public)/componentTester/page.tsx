"use client";

import { Typography } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import styles from "./componentTester.module.scss";

export default function ComponentTester() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const componentWrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateSize = () => {
      setSize({
        width: componentWrapRef.current!.clientWidth,
        height: componentWrapRef.current!.clientHeight,
      });
    };
    updateSize();
    const resizeObserver = new ResizeObserver(updateSize);
    if (componentWrapRef.current) {
      resizeObserver.observe(componentWrapRef.current);
    }

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <section className={styles.componentTester}>
      <div className={styles.size}>
        <Typography variant="h4">
          Width: {size.width} Height: {size.height}
        </Typography>
      </div>
      <div ref={componentWrapRef} className={styles.componentWrap}></div>
    </section>
  );
}
