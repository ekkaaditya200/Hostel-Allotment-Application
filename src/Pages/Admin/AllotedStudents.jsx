import { useEffect, useState, useMemo } from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";
import Layout from "../../Components/Layout";
import { Button, Stack } from '@mui/material';
import { db } from "../../Firebase/Config";
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const VISIBLE_FIELDS = [
  "id",
  "name",
  "rollno",
  "room",
];


export default function AllotedStudents() {
  const [selectdRows, setSelectedRows] = useState([]);
  const [data, setData] = useState({
    columns: [
      { field: "id", headerName: "S.No", width: 200 },
      { field: "name", groupable: false, headerName: "Name", width: 200 },
      { field: "rollno", headerName: "Roll No", width: 200 },
      { field: "room", headerName: "Room No", width: 200 },
    ],
    rows: [],
  });
  const handleSelection = (Rows) => {
    const selectedRowsData = data.rows.filter((row) => Rows.includes(row.id));
    setSelectedRows(selectedRowsData);
  }
  const deallocate = async () => {

    const coll = collection(db, 'bookingData');

    if (selectdRows.length) {
      for (const row of selectdRows) {
        const q = query(coll, where('userId', '==', row.userId));
        const querySnapshot = await getDocs(q);

        // Find student in the booking database
        for (const document of querySnapshot.docs) {
          const studentData = document.data();

          // If student found, then allocate room if it is not full
          if (studentData) {
            console.log(studentData);

            const roomcoll = collection(db, 'rooms');
            const roomquery = query(roomcoll, where('roomNo', '==', studentData.room));
            const roomquerySnapshot = await getDocs(roomquery);

            for (const roomDoc of roomquerySnapshot.docs) {
              const roomis = roomDoc.data();
              console.log("Room data = ", roomis);

              // Check if room has available slots
              if (roomis) {
                // Allocate the room by updating the bookingData document
                const docId = `${row.userId}_${row.rollno}`;
                const docRef = doc(db, 'bookingData', docId);

                const roomRef = doc(db, 'rooms', roomDoc.id);

                await updateDoc(roomRef, {
                  slots: roomis.slots + 1
                });

                await updateDoc(docRef, {
                  isverified: false
                });

                toast.success(`Room Dealloted to the user successfully ! ${row.rollno} `, {
                  position: "top-center",
                  autoClose: 5000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });
              }
            }
          }
        }
      }
    } else {
      console.log("Please select the student(s)");
    }
  };

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
      <Stack direction={'column'}>
        <Box>
          <Button onClick={deallocate}>Deallocate</Button>
        </Box>
        <Box sx={{ height: 400, width: '100%' }}>
          <DataGrid
            rows={data.rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5]}
            checkboxSelection
            disableRowSelectionOnClick
            onRowSelectionModelChange={handleSelection}
          />
        </Box>
      </Stack>
      </Box>
    </Layout>


  );
}
