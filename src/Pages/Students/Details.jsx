import { useState, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
import { Link } from "react-router-dom"
import { app, storage } from '../../Firebase/Config';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { useStateContext } from '../../Contexts/ContextProvider';
import {
    getFirestore,
    addDoc,
    collection,
    getDocs,
    query,
    where,
} from 'firebase/firestore';
import Layout from '../../Components/Layout';


const firestore = getFirestore(app);
const Details = () => {
    const { user } = useStateContext();
    const [formData, setFormData] = useState({
    });

    useEffect(() => {
        if (user) {
            setFormData({ userId: user.userId});
        }
    }, [])

    const [result, setResult] = useState();
    const [feeReceipt, setFeeReceipt] = useState();
    const [studentData, setStudentData] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value })
    }

    const uploadFeeReceipt = async () => {
        if (!feeReceipt) {
            console.error("Please select a file for result upload");
            return;
        }
        try {
            const feeReceiptRef = ref(storage, `files/feeReceipt/${formData.rollno}`);
            await uploadBytes(feeReceiptRef, feeReceipt);
            const url = await getDownloadURL(feeReceiptRef);
            return url;
        }
        catch (error) {
            console.log(error);
        }
    }
    const uploadResult = async () => {
        if (!result) {
            console.error("Please select a file for result upload");
            return;
        }
        try {
            const resultRef = ref(storage, `files/result/${formData.rollno}`);
            await uploadBytes(resultRef, result);
            const url = await getDownloadURL(resultRef);
            return url;
        }
        catch (error) {
            console.log(error);
        }
    }
    const uploadDetails = async (formData) => {
        try {
            const [url1, url2] = await Promise.all([
                uploadFeeReceipt(),
                uploadResult(),
            ]);

            console.log(url1, url2);

            // Create a new object with the updated formData
            const updatedFormData = { ...formData, feeUrl: url1, resultUrl: url2 };
            setFormData(updatedFormData);
            console.log("Form Data = ", updatedFormData);

            const coll = collection(firestore, "studentData");

            // Add data to Firestore after successful uploads
            await addDoc(coll, updatedFormData).then(() => {
                alert("Data added Successfully!");
            }).catch((error) => {
                console.error("Error adding data:", error);
                // Handle Firestore addition error (optional)
            });
        } catch (error) {
            console.error("Error uploading details:", error);
            // Handle upload errors (optional)
        }
    };



    async function handleSubmit(e) {
        e.preventDefault();
        await uploadDetails(formData);
    }


    const getDetails = async () => {
        const coll = collection(firestore, "studentData")
        const q = query(coll, where('userId', '==', formData.userId));

        const snapshot = await getDocs(q);
        snapshot.forEach((doc) => {
            setFormData(doc.data());
        });
    }

    console.log(formData);

    // useEffect(() => {
    //     getDetails();
    // }, [])

    return (
        <Layout>
        <div className="w-[90%] h-[90%] flex flex-col">
            <h1 className='font-bold text-[2rem] w-full text-center'>Details</h1>
            <form className='mt-5 p-5' onSubmit={handleSubmit} action={<Link to="/login" />}>
                <Stack gap={3} direction={{ sm: "column", lg: "row" }} sx={{ marginBottom: 4 }}>
                    <TextField
                        required
                        onChange={handleChange}
                        id="fullname"
                        label="Full Name"
                    />
                    <TextField
                        required
                        onChange={handleChange}
                        id="rollno"
                        label="Roll No"
                    />
                    <TextField
                        required
                        onChange={handleChange}
                        id="email"
                        type="email"
                        label="Email"
                        sx={{ mb: 4 }}
                        variant='outlined'
                        color='secondary'
                    />
                    <TextField
                        id="room"
                        label="Room"
                        defaultValue="Na"
                        InputProps={{
                            readOnly: true,
                        }}
                    />
                    <TextField
                        id="department"
                        onChange={handleChange}
                        type="text"
                        label="Department"
                        // defaultValue="Computer Science and Engineering"
                        // InputProps={{
                        //     readOnly: true,
                        // }}
                        sx={{ mb: 4 }}
                        variant='outlined'
                        color='secondary'
                    />
                    <TextField
                        required
                        onChange={handleChange}
                        id='sgpi'
                        type="number"
                        label="SGPI"
                        sx={{ mb: 4 }}
                        variant='outlined'
                        color='secondary'
                    />

                </Stack>
                <Stack spacing={2} direction={{ sm: "column", lg: "row" }} sx={{ marginBottom: 4 }}>
                    <TextField
                        onChange={(e) => setResult(e.target.files[0])}
                        required
                        id='result'
                        label="Result"
                        variant="outlined"
                        color="secondary"
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        id='feereceipt'
                        onChange={(e) => setFeeReceipt(e.target.files[0])}
                        required
                        label="Fee Receipt"
                        variant="outlined"
                        color="secondary"
                        type="file"
                        InputLabelProps={{ shrink: true }}
                        sx={{ mb: 3 }}
                    />

                    <TextField
                        id='hostelfee'
                        onChange={handleChange}
                        required
                        label="Hostel Fee"
                        variant="outlined"
                        color="secondary"
                        type="number"
                        sx={{ mb: 3 }}
                    />
                    <TextField
                        onChange={handleChange}
                        required
                        id='referenceno'
                        label="Reference No"
                        variant="outlined"
                        color="secondary"
                        type="text"
                        sx={{ mb: 3 }}
                    />
                </Stack>
                <Button variant="outlined" color="secondary" type="submit">Submit</Button>
            </form>
            <button onClick={getDetails}>Get Details</button>
        </div>
        </Layout>
    )
}

export default Details;