"use client"

import { Box } from "@mui/material";
import { LineChart, SparkLineChart } from "@mui/x-charts";
import { getData } from "@/utils/getData";
import { useEffect, useState } from "react";

interface GraphData {
    power: number[];
    current: number[];
    voltage: number[];
    timestamp: string[];
}

export default function Graphs() {
    const [graphData, setGraphData] = useState<GraphData>();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const data = await getData();
                const graphs = {
                    power: [] as number[],
                    current: [] as number[],
                    voltage: [] as number[],
                    timestamp: [] as string[],
                };
                for (const entry of data) {
                    graphs.power.push(entry.power);
                    graphs.current.push(entry.current);
                    graphs.voltage.push(entry.voltage);
                    graphs.timestamp.push(entry.ts);
                }
                setGraphData(graphs);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading || !graphData) {
        return <div>Loading...</div>;
    }

    return (
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: '40px', overflow: 'hidden' }}>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px' }}>
                <SparkLineChart data={graphData.power} height={200} />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px' }}>
                <LineChart
                    series={[
                        { data: graphData.current, label: 'Current' },
                    ]}
                    height={200} 
                    xAxis={[{ scaleType: 'point', data: graphData.timestamp }]}
                    />
            </Box>
            <Box sx={{ flexGrow: 1, flexBasis: '400px', minWidth: '200px' }}>
                <SparkLineChart data={graphData.voltage} height={200} />
            </Box>
        </Box>
    )

}