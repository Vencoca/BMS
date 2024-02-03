import { useEffect, useState } from "react";

export default function Data() {
    const [data, setData] = useState()

    useEffect(() => {
        
    },[])

    return (
        <>
            <h1>This is data</h1>
            <div>
                {data ? "" : data}
            </div>
        </>
    )
}