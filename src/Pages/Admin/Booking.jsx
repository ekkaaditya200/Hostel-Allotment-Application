import { useEffect } from 'react'
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import { useState } from 'react';
import { collection, getDocs, query, where, updateDoc, doc } from 'firebase/firestore';
import { db } from '../../Firebase/Config';
import { Button, Stack } from '@mui/material';
import Layout from "../../Components/Layout";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useStateContext } from '../../Contexts/ContextProvider';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    width: 150,
    editable: true,
  },
  {
    field: 'rollno',
    headerName: 'RollNo',
    width: 150,
    editable: true,
  },
  {
    field: 'room',
    headerName: 'Room',
    width: 110,
    editable: true,
  },
];

export default function Booking() {
  const { currentMode } = useStateContext();
  const [selectdRows, setSelectedRows] = useState([]);
  const [rows, setRows] = useState([]);

  // Get the selected row(s) for the allocation
  const handleSelection = (Rows) => {
    const selectedRowsData = rows.filter((row) => Rows.includes(row.id));
    setSelectedRows(selectedRowsData);
  }

  // console.log("\nSelect rows", selectdRows);

  //Allocate the selected row(s) when allocate button is clicked
  const allocate = async () => {

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

            //! console.log(studentData);

            const roomcoll = collection(db, 'rooms');

            const roomquery = query(roomcoll, where('roomNo', '==', studentData.room));
            const roomquerySnapshot = await getDocs(roomquery);

            for (const roomDoc of roomquerySnapshot.docs) {
              const roomis = roomDoc.data();
              
              //! console.log("Room data = ", roomis);

              // Check if room has available slots
              if (roomis && (roomis.slots > 0)) {
                // Allocate the room by updating the bookingData document
                const docId = `${row.userId}_${row.rollno}`;
                const docRef = doc(db, 'bookingData', docId);

                const roomRef = doc(db, 'rooms', roomDoc.id);

                await updateDoc(roomRef, {
                  slots: roomis.slots - 1
                });

                await updateDoc(docRef, {
                  isverified: true
                });

                //Update the room of actual details data
                const studentcoll = collection(db, 'studentData');
                const studentQuery=query(studentcoll, where('userId','==',row.userId))
                const studentsSnapshot = await getDocs(studentQuery);
                for (const document of studentsSnapshot.docs) {
                  const student = document.data();
                  if (student) {
                    const studentDocRef = doc(studentcoll, document.id);
                    await updateDoc(studentDocRef, {
                      room:studentData.room
                    });
                  }}
               
                toast.success(`Room Alloted to  ${row.rollno} successfully !`, {
                  position: "top-center",
                  autoClose: 3000,
                  hideProgressBar: false,
                  closeOnClick: true,
                  pauseOnHover: true,
                  draggable: true,
                  progress: undefined,
                  theme: "light",
                  });
              }
              else
              {
                toast.error(`Room is already full ! Can't allot to ${row.rollno} `, {
                  position: "top-center",
                  autoClose: 3000,
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


  //Get the students who are requested for the room for allocation
  useEffect(() => {
    const getBookingdata = async () => {
      const coll = collection(db, 'bookingData');
      const q = query(coll, where('isverified', '==', false));
      const snapShot = await getDocs(q);
      const fetchedData = snapShot.docs.map((doc, index) => {
        const studentData = doc.data();
        return { ...studentData, id: index + 1 }
      })
      setRows(fetchedData);
    }
    getBookingdata();
  }, [])

  return (
    <Layout>
       <Box sx={{ height: '90%', width: '90%', position: "absolute" }}>
      <Stack direction={'column'}>
        <Box>
          <Button onClick={allocate}>Allocate</Button>
        </Box>
        <Box
         sx={{ height: 400, width: '100%','& .MuiDataGrid-root': {
          color: currentMode === 'Dark' ? 'white' : 'black',
        } }}
        >
          <DataGrid
            rows={rows}
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
