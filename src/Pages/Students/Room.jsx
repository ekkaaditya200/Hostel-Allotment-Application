import { useEffect, useState } from 'react';
import { Input, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { app, db } from '../../Firebase/Config';
import { getFirestore, setDoc, collection, getDocs, query, where, doc } from 'firebase/firestore';
import { useStateContext } from '../../Contexts/ContextProvider';
import Layout from '../../Components/Layout';

const roomsData = [
    {
        block: 'A',
        floors: [
            { floor: 'Floor 1', rooms: ['A101', 'A102', 'A103', 'A104'] },
            { floor: 'Floor 2', rooms: ['A201', 'A202', 'A203', 'A204'] },
        ],
    },
    {
        block: 'B',
        floors: [
            { floor: 'Floor 1', rooms: ['B101', 'B102', 'B103', 'B104'] },
            { floor: 'Floor 2', rooms: ['B201', 'B202', 'B203', 'B204'] },
        ],
    },
    {
        block: 'C',
        floors: [
            { floor: 'Floor 1', rooms: ['C101', 'C102', 'C103', 'C104'] },
            { floor: 'Floor 2', rooms: ['C201', 'C202', 'C203', 'C204'] },
            { floor: 'Floor 3', rooms: ['C201', 'C202', 'C203', 'C204'] },
        ],
    },
];

function App() {
    const { user } = useStateContext();
    const [searchQuery, setSearchQuery] = useState('');
    const [alloted, setAlloted] = useState(false);
    const [ask, setAsk] = useState(false);

    const [studentData, setStudentData] = useState({
    })

    const getBokingData = async () => {
        const q = query(collection(db, 'bookingData'), where('userId', '==', user.userId));

        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            console.log(doc.data());
            if (doc.data().room != '' && !doc.data().isverified) {
                setAsk(true)
            }
            else if (doc.data().room != '' && doc.data().isverified) {
                console.log("Come or Not");
                setAlloted(true);
            }
            setStudentData(doc.data());
        })

    }



    useEffect(() => {
        getBokingData();
    }, [])

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const filteredRooms = roomsData.reduce((filtered, blockElem) => {
        const matchedBlock = blockElem.block.toLowerCase().includes(searchQuery.toLowerCase());

        const filteredFloors = blockElem.floors.filter((floorElem) => {
            const matchedFloor = floorElem.floor.toLowerCase().includes(searchQuery.toLowerCase());

            const matchedRooms = floorElem.rooms.filter((room) => room.toLowerCase().includes(searchQuery.toLowerCase()));

            return matchedFloor || matchedRooms.length > 0;
        });

        if (matchedBlock || filteredFloors.length > 0) {
            return [...filtered, { ...blockElem, floors: filteredFloors }];
        }

        return filtered;
    }, []);

    const getData = async () => {
        try {
          const col = collection(db, 'studentData');
          const snapShot = await getDocs(col);
    
          const fetchedData = snapShot.docs.map((doc, index) => {
            const studentData = doc.data();
            return {
              ...studentData,
              id: index + 1,
              sgpi: parseFloat(studentData.sgpi), // Convert to number
              hostelfee: parseFloat(studentData.hostelfee), // Convert to number
            }; // Add unique ID
          });
          return fetchedData[0].rollno;
        } catch (error) {
          console.error('Error fetching data:', error);
          // Handle errors gracefully, e.g., display an error message to the user
        }
      };
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const rollno = await getData();
        const db = getFirestore(app);
        try {
            //Generate a specific document id 
            const docId = `${user.userId}_${rollno}`
            // Reference to the collection and specific document
            const coll = collection(db, 'bookingData');
            //Use doc to specify the document ID
            const docRef = doc(coll, docId);

            await setDoc(docRef, {
                name: user.name,
                userId: user.userId,
                rollno: rollno,
                room: studentData.room,
                isverified: false,
            });

            setAsk(true);
            alert("Booking is done")
        } catch (error) {
            console.log(error);
        }
    }

    // }

    return (
        <Layout>
        <Stack className="p-4 flex flex-col gap-10 w-[90%] h-[90%]">
            {
                alloted && <>
                    <div>
                        <h1>Room A 101 Alloted</h1>
                    </div>
                </>
            }
            {
                !alloted && (
                    ask == false ? <div>
                        <h1 className='font-bold'>Ask for the room</h1>
                        <form onSubmit={handleSubmit}>
                            <TextField
                                label="Room No"
                                variant="outlined"
                                fullWidth
                                margin="normal"
                                onChange={(e) => setStudentData({ ...studentData, room: e.target.value })}
                            />
                            <Button
                                variant="contained"
                                color="primary"
                                type="submit"
                            >
                                Submit
                            </Button>
                        </form>
                    </div>
                        : <div>
                            <h1 className='font-bold'>Room A 108 not Alloted Yet</h1>
                        </div>

                )
            }

            <div>
                <h1 className='font-bold'>Search Room</h1>
                <Input
                    className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    placeholder="Search Block, Floor or Room"
                    value={searchQuery}
                    onChange={handleSearchChange}
                />
                <div className="grid grid-cols-1 gap-4 mt-4">
                    {filteredRooms.map((block) => (
                        <div key={block.block} className="bg-gray-100 rounded-md shadow-md p-4">
                            <h3 className="text-lg font-medium mb-2">{block.block}</h3>
                            {block.floors.map((floor) => (
                                <div key={floor.floor} className="flex flex-wrap gap-4 mb-2">
                                    <h4 className="text-base font-medium">{floor.floor}</h4>
                                    {floor.rooms.map((room) => (
                                        <div key={room} className="bg-white rounded-md px-3 py-1 shadow-sm">
                                            {room}
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </div>
                    ))}
                </div>
            </div>
        </Stack>
        </Layout>
    );
}

export default App;
