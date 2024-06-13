import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { data } from './Data'
// import { isEditable } from "@syncfusion/ej2/grids";

const VISIBLE_FIELDS = [
  "id",
  "Name",
  "Roll No",
  "Department",
  "CGPI",
];

export default function Students() {
  // console.log(data);

  // Otherwise filter will be applied on fields such as the hidden column id
  const columns = React.useMemo(
    () =>
      data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  return (
    <Box  sx={{ height: '90%', width: '90%', position:"absolute"}}>
      <DataGrid
        {...data}
        disableColumnFilter
        disableColumnSelector
        disableDensitySelector
        columns={columns}
        slots={{ toolbar: GridToolbar }}
        slotProps={{
          toolbar: {
            showQuickFilter: true,
          },
        }}
      />
    </Box>
  );
}
