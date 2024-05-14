import { Paper } from "@mui/material";
import { LineChart } from "@mui/x-charts";
import { DataGrid, GridColDef, useGridApiRef } from "@mui/x-data-grid";
import { useState } from "react";

export default function GraphAndTable({
  graph,
  graphData
}: {
  graph: any;
  graphData: any;
}) {
  const apiRef = useGridApiRef();
  const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
  const columns: GridColDef<(typeof rows)[number]>[] = [
    { field: "id", headerName: "ID", width: 90 },
    {
      field: "value",
      headerName: "Data"
    },
    {
      field: "timeStamp",
      headerName: "Timestamp",
      width: 400
    }
  ];

  // const rows = [
  //   { id: 0, value: "Snow", timeStamp: "Jon" },
  //   { id: 1, value: "Lannister", timeStamp: "Cersei" },
  //   { id: 2, value: "Lannister", timeStamp: "Jaime" },
  //   { id: 3, value: "Stark", timeStamp: "Arya" },
  //   { id: 4, value: "Targaryen", timeStamp: "Daenerys" },
  //   { id: 5, value: "Melisandre", timeStamp: null },
  //   { id: 6, value: "Clifford", timeStamp: "Ferrara" },
  //   { id: 7, value: "Frances", timeStamp: "Rossini" },
  //   { id: 8, value: "Roxie", timeStamp: "Harvey" }
  // ];

  const rows = (graphData as { timestamp: Date; value: number }[]).map(
    (row, index) => ({
      id: index,
      value: row.value,
      timeStamp: row.timestamp
    })
  );

  return (
    <Paper
      sx={{
        width: "100%",
        overflow: "hidden",
        height: "calc(100% - 48px)",
        marginTop: "48px",
        display: "grid",
        gridTemplateColumns: "70% 30%"
      }}
    >
      <LineChart
        sx={{ cursor: "pointer" }}
        xAxis={[
          {
            scaleType: "time",
            dataKey: "timestamp",
            label: graph.xAxis
          }
        ]}
        yAxis={[{ label: graph.yAxis }]}
        series={[{ dataKey: "value" }]}
        dataset={graphData}
        tooltip={{ trigger: "none" }}
        onAxisClick={(event: any, data: any) => {
          apiRef.current.scrollToIndexes({ rowIndex: data.dataIndex });
          setSelectedRowIndex(data.dataIndex);
        }}
      ></LineChart>
      <DataGrid
        apiRef={apiRef}
        rows={rows}
        columns={columns}
        hideFooter={true}
        rowSelectionModel={selectedRowIndex !== null ? [selectedRowIndex] : []}
        disableColumnFilter={true}
        disableColumnSorting={true}
        disableColumnMenu={true}
      />
    </Paper>
  );
}
