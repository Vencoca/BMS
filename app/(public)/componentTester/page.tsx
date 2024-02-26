"use client"

import { Typography } from "@mui/material"
import styles from "./componentTester.module.scss"
import { useEffect, useRef, useState } from "react"
import HorizontalLinearStepper from "@/components/CreateEndpoint"


export default function componentTester() {
    const [size, setSize] = useState({ width: 0, height: 0 })
    const componentWrapRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        const updateSize = () => {
            setSize({
                width: componentWrapRef.current!.clientWidth,
                height: componentWrapRef.current!.clientHeight,
            })
        }
        updateSize()
        const resizeObserver = new ResizeObserver(updateSize);
        if (componentWrapRef.current) {
            resizeObserver.observe(componentWrapRef.current);
        }

        return () => {
            resizeObserver.disconnect();
        };
    }, [])

    return (
        <section className={styles.componentTester}>
            <div className={styles.size}>
                <Typography variant="h4">Width: {size.width} Height: {size.height}</Typography>
            </div>
            <div ref={componentWrapRef} className={styles.componentWrap}>
                <HorizontalLinearStepper></HorizontalLinearStepper>
            </div>
        </section>
    )
}