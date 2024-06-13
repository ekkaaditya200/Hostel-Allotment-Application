import { useState } from 'react';
import {Input, Stack } from '@mui/material';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

const roomsData = [
    {
        block: 'A',
        floors: [
            { floor: 'Floor 1', rooms: ['A 101', 'A 102', 'A 103', 'A 104'] },
            { floor: 'Floor 2', rooms: ['A 201', 'A 202', 'A 203', 'A 204'] },
        ],
    },
    {
        block: 'B',
        floors: [
            { floor: 'Floor 1', rooms: ['B 101', 'B 102', 'B 103', 'B 104'] },
            { floor: 'Floor 2', rooms: ['B 201', 'B 202', 'B 203', 'B 204'] },
        ],
    },
    {
        block: 'C',
        floors: [
            { floor: 'Floor 1', rooms: ['C 101', 'C 102', 'C 103', 'C 104'] },
            { floor: 'Floor 2', rooms: ['C 201', 'C 202', 'C 203', 'C 204'] },
            { floor: 'Floor 3', rooms: ['C 201', 'C 202', 'C 203', 'C 204'] },
        ],
    },
];

function App() {
    const [searchQuery, setSearchQuery] = useState('');

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






    return (
        <Stack className="p-4 flex flex-col gap-10 w-[90%] h-[90%]">
            <div>
           <h1 className='font-bold'>Ask for the room</h1>
            <form>
                <TextField
                    label="Room No"
                    variant="outlined"
                    fullWidth
                    margin="normal"
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
    );
}

export default App;
