import { TextField, Button, Stack } from '@mui/material';
import { Link } from "react-router-dom"


const Details = () => {

    function handleSubmit(event) {
        event.preventDefault();
    }

    return (
        <div className="w-[90%] h-[90%] flex flex-col">
            <h1 className='font-bold text-[2rem] w-full text-center'>Details</h1>
            <form className='mt-5 p-5' onSubmit={handleSubmit} action={<Link to="/login" />}>
                <Stack gap={3} direction={{ sm: "column", lg: "row" }} sx={{ marginBottom: 4 }}>
                    <TextField
                        id="outlined-read-only-input"
                        label="Full Name"
                        defaultValue="Aditya Ekka"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-read-only-input"
                        label="Roll No"
                        defaultValue="21bcs119"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-read-only-input"
                        type="email"
                        label="Email"
                        defaultValue="21bcs119@nith.ac.in"
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{ mb: 4 }}
                        variant='outlined'
                        color='secondary'
                    />
                    <TextField
                        id="outlined-read-only-input"
                        label="Room"
                        defaultValue="Na"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="outlined-read-only-input"
                        type="text"
                        label="Department"
                        defaultValue="Computer Science and Engineering"
                        InputProps={{
                            readOnly: true,
                        }}
                        sx={{ mb: 4 }}
                        variant='outlined'
                        color='secondary'
                    />
                    <TextField
                        type="number"
                        label="SGPI"
                        defaultValue="8.84"
                        sx={{ mb: 4 }}
                        variant='outlined'
                        color='secondary'
                    />

                </Stack>
                <Stack spacing={2} direction={{ sm: "column", lg: "row" }} sx={{ marginBottom: 4 }}>
                    <TextField
                        required
                        label="Result"
                        variant="outlined"
                        color="secondary"
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        required
                        label="Fee Receipt"
                        variant="outlined"
                        color="secondary"
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        required
                        label="Hostel Fee Amount"
                        variant="outlined"
                        color="secondary"
                        type="number"
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        required
                        label="Reference Number"
                        variant="outlined"
                        color="secondary"
                        type="text"
                        sx={{ mb: 3 }}
                    />
                </Stack>

                <Button variant="outlined" color="secondary" type="submit">Submit</Button>
            </form>

        </div>
    )
}

export default Details;