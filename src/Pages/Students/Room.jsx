import { useEffect, useState } from "react";
import { Stack } from "@mui/material";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import { app, db } from "../../Firebase/Config";
import {
  getFirestore,
  setDoc,
  collection,
  getDocs,
  query,
  where,
  doc,
} from "firebase/firestore";
import { useStateContext } from "../../Contexts/ContextProvider";
import Layout from "../../Components/Layout";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { user } = useStateContext();
  const [searchQuery, setSearchQuery] = useState("");
  const [alloted, setAlloted] = useState(false);
  const [ask, setAsk] = useState(false);
  const [showRoomates, setShowRoomates] = useState(false);
  const [rooms, setRooms] = useState([]);

  const [studentData, setStudentData] = useState({});

  const getBokingData = async () => {
    const q = query(
      collection(db, "bookingData"),
      where("userId", "==", user.userId)
    );

    const snapshot = await getDocs(q);
    snapshot.forEach((doc) => {
      if (doc.data().room != "" && !doc.data().isverified) {
        setAsk(true);
      } else if (doc.data().room != "" && doc.data().isverified) {
        setAlloted(true);
      }
      setStudentData(doc.data());
    });
  };

  const getRoomsData = async () => {
    try {
      const coll = collection(db, "rooms");
      const snapShot = await getDocs(coll);

      // Fetch and map the data from Firestore
      const fetchedData = snapShot.docs.map((doc) => doc.data());

      // Organize data in the desired format
      const roomsData = fetchedData.reduce((acc, room) => {
        const { block, roomNo, isfull, slots } = room;
        const floorNum = `Floor ${roomNo[1]}`; // Extract floor from roomNo, e.g., "A108" -> "Floor 1"

        // Find the block in the accumulator, or create a new one if it doesn't exist
        let blockEntry = acc.find((b) => b.block === block);
        if (!blockEntry) {
          blockEntry = { block, floors: [] };
          acc.push(blockEntry);
        }

        // Find the floor in the block, or create a new one if it doesn't exist
        let floorEntry = blockEntry.floors.find((f) => f.floor === floorNum);
        if (!floorEntry) {
          floorEntry = { floor: floorNum, rooms: [] };
          blockEntry.floors.push(floorEntry);
        }

        // Add the room data to the floor's rooms array
        floorEntry.rooms.push({ roomNo, isfull, slots });

        return acc;
      }, []);

      // Sort blocks alphabetically
      roomsData.sort((a, b) => a.block.localeCompare(b.block));

      // Sort floors and rooms within each block
      roomsData.forEach((block) => {
        // Sort floors numerically based on floor number
        block.floors.sort((a, b) => {
          const floorA = parseInt(a.floor.split(" ")[1]);
          const floorB = parseInt(b.floor.split(" ")[1]);
          return floorA - floorB;
        });

        // Sort rooms within each floor by roomNo
        block.floors.forEach((floor) => {
          floor.rooms.sort((a, b) => a.roomNo.localeCompare(b.roomNo));
        });
      });

      setRooms(roomsData); // Set the transformed and sorted data to state
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getBokingData();
    getRoomsData();
  }, []);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredRooms = rooms.reduce((filtered, blockElem) => {
    const matchedBlock = blockElem.block
      .toLowerCase()
      .includes(searchQuery.toLowerCase());

    const filteredFloors = blockElem.floors.filter((floorElem) => {
      const matchedFloor = floorElem.floor
        .toLowerCase()
        .includes(searchQuery.toLowerCase());

      const matchedRooms = floorElem.rooms.filter((room) =>
        room.roomNo.toLowerCase().includes(searchQuery.toLowerCase())
      );

      return matchedFloor || matchedRooms.length > 0;
    });

    if (matchedBlock || filteredFloors.length > 0) {
      return [...filtered, { ...blockElem, floors: filteredFloors }];
    }

    return filtered;
  }, []);

  const getData = async () => {
    try {
      const col = collection(db, "studentData");
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
      console.error("Error fetching data:", error);
      // Handle errors gracefully, e.g., display an error message to the user
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const rollno = await getData();
    const db = getFirestore(app);
    try {
      //Generate a specific document id
      const docId = `${user.userId}_${rollno}`;
      // Reference to the collection and specific document
      const coll = collection(db, "bookingData");
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
      toast.success(`Room ${rollno} is successfully requested !`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } catch (error) {
      console.log(error);
    }
  };

  // }

  return (
    <Layout>
      <Stack className="p-4 flex flex-col gap-10 w-[90%] h-[90%] dark:text-gray-300 text-slate-700 cursor-default">
        {alloted && (
          <>
            <div className="w-full flex justify-center items-center bg-slate-200 rounded-lg p-5 relative">
              <h1 className="font-bold">
                Room <span className="text-blue-500">{studentData.room}</span>{" "}
                is alloted to you
              </h1>

              {showRoomates == false ? (
                <h1
                  className="absolute bottom-1 right-2 text-blue-600 text-[12px] cursor-pointer"
                  onClick={() => setShowRoomates(true)}
                >
                  Roommates
                </h1>
              ) : (
                <h1
                  className="absolute bottom-1 right-2 text-blue-600 text-[12px] cursor-pointer"
                  onClick={() => setShowRoomates(false)}
                >
                  Close
                </h1>
              )}
              {showRoomates && (
                <div className="absolute top-20 right-0 border-2 rounded-md px-5 py-4 bg-slate-200">
                  <div className="flex gap-5 justify-between font-bold mb-1">
                    <span>Name</span>
                    <span>RollNo</span>
                  </div>
                  <div className="flex gap-5 justify-around">
                    <span>Aditya Ekka</span>
                    <span>21bcs119</span>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
        {!alloted &&
          (ask == false ? (
            <div>
              <h1 className="font-bold">Ask for the room</h1>
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Room No"
                  variant="outlined"
                  fullWidth
                  margin="normal"
                  onChange={(e) =>
                    setStudentData({ ...studentData, room: e.target.value })
                  }
                />
                <Button variant="contained" color="primary" type="submit">
                  Submit
                </Button>
              </form>
            </div>
          ) : (
            <div className="w-full flex justify-center items-center bg-slate-200 rounded-lg p-5">
              <h1 className="font-bold text-slate-700">
                Room {studentData.room} is not alloted yet
              </h1>
            </div>
          ))}

        <div>
          <h1 className="font-bold">Search Room</h1>
          <input
            className="w-full py-2 px-3 rounded-md border border-gray-300 focus:outline-none focus:ring-1 focus:ring-blue-500 dark:text-slate-700"
            placeholder="Search Block, Floor or Room"
            value={searchQuery}
            onChange={handleSearchChange}
          ></input>
          <div className="grid grid-cols-1 gap-4 mt-4">
            {filteredRooms.map((block) => (
              <div
                key={block.block}
                className="dark:bg-main-dark-bg bg-main-bg  rounded-md shadow-md p-4"
              >
                <h3 className="text-lg font-medium mb-2">{block.block}</h3>
                {block.floors.map((floor) => (
                  <div key={floor.floor} className="flex flex-wrap gap-4 mb-2">
                    <h4 className="text-base font-medium">{floor.floor}</h4>
                    {floor.rooms.map((room) => (
                      <div key={room.roomNo}>
                        <Tooltip
                          title={`${
                            room.isfull == true ? "Room is full !" : ""
                          } 
                        ${
                          room.isfull == false
                            ? room.slots == 1
                              ? `${room.slots} slot avaliable`
                              : `${room.slots} slots avaliable`
                            : ""
                        }`}
                          placement="top"
                          arrow
                        >
                          <div
                            key={room.roomNo}
                            className={`${
                              room.isfull == true
                                ? "bg-red-300"
                                : "bg-green-300"
                            } rounded-md text-slate-700 px-3 py-1 shadow-sm`}
                          >
                            {room.roomNo}
                          </div>
                        </Tooltip>
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
