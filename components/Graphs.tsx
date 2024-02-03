"use client"

import { Box } from "@mui/material";
import { SparkLineChart } from "@mui/x-charts";

export default function Graphs() {
    return (<>
        <Box sx={{display: 'flex', flexWrap: 'wrap', gap: '40px', overflow: 'hidden'}}>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={200} />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart
                    plotType="bar"
                    data={[1, 4, 2, 5, 7, 2, 4, 6]}
                    height={200}
                />
            </Box>
            <Box sx={{ flexGrow: 1,  flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={200} />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart
                    plotType="bar"
                    data={[1, 4, 2, 5, 7, 2, 4, 6]}
                    height={200}
                />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={200} />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart
                    plotType="bar"
                    data={[1, 4, 2, 5, 7, 2, 4, 6]}
                    height={200}
                />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart data={[1, 4, 2, 5, 7, 2, 4, 6]} height={200} />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px'}}>
                <SparkLineChart
                    plotType="bar"
                    data={[1, 4, 2, 5, 7, 2, 4, 6]}
                    height={200}
                />
            </Box>
        </Box>
    </>
    )

}