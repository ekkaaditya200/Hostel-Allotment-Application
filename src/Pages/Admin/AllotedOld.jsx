import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { db } from '../../Firebase/Config';
import { collection, getDocs } from 'firebase/firestore';
import Layout from "../../Components/Layout";

const VISIBLE_FIELDS = [
  "id",
  "name",
  "rollno",
  "room",
];

export default function AllotedStudents() {
  const [data, setData] = useState({
    columns: [
      { field: "id", headerName: "S.No", width: 200 },
      { field: "name", groupable: false, headerName: "Name", width: 200 },
      { field: "rollno", headerName: "Roll No", width: 200 },
      { field: "room", headerName: "Room No", width: 200 },
    ],
    rows: [],
  });

  const getData = async () => {
    try {
      const col = collection(db, 'bookingData');
      const snapShot = await getDocs(col);

      const fetchedData = snapShot.docs.map((doc, index) => {
        const studentData = doc.data();
        if (studentData.isverified) {
          return {
            ...studentData,
            id: index + 1,
            sgpi: parseFloat(studentData.sgpi), // Convert to number
            hostelfee: parseFloat(studentData.hostelfee), // Convert to number
          };
        }
        return null;
      }).filter(data => data !== null); // Filter out null values

      try {
        setData((prevData) => ({ ...prevData, rows: fetchedData })); // Update with fetched data
      } catch (error) {
        console.error('Error fetching data:', error);
        // Handle errors gracefully, e.g., display an error message to the user
      }
    } catch (error) {
      console.error('Error fetching data:', error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  useEffect(() => {
    getData(); // Call getData on component mount
  }, []); // Empty dependency array to run only once on mount

  const columns = useMemo(
    () =>
      data.columns.filter((column) => VISIBLE_FIELDS.includes(column.field)),
    [data.columns]
  );

  return (
    <Layout>
      <Box sx={{ height: '90%', width: '90%', position: "absolute" }}>
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
    </Layout>
  );
}
