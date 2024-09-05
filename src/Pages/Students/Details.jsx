import { useState, useEffect } from 'react';
import { TextField, Button, Stack } from '@mui/material';
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
  updateDoc,
  doc
} from 'firebase/firestore';
import Layout from '../../Components/Layout';

const firestore = getFirestore(app);

const Details = () => {
  const { user, currentMode } = useStateContext();
  const [formData, setFormData] = useState({
    room:"",
  });
  const [result, setResult] = useState(null);
  const [feeReceipt, setFeeReceipt] = useState(null);
  const [studentDataExists, setStudentDataExists] = useState(false);

  console.log(formData);

  useEffect(() => {
    if (user) {
      setFormData({ userId: user.userId });
      getDetails();
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

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

  const uploadDetails = async () => {
    try {
      const feeUrl = feeReceipt ? await uploadFeeReceipt() : formData.feeUrl;
        const resultUrl = result ? await uploadResult() : formData.resultUrl;

        const updatedFormData = { 
            ...formData, 
            feeUrl: feeUrl || formData.feeUrl, 
            resultUrl: resultUrl || formData.resultUrl 
        };

      const coll = collection(firestore, "studentData");
      if (studentDataExists) {
        const studentDocRef = doc(coll, formData.id); // Use formData.id for the document reference
        await updateDoc(studentDocRef, updatedFormData);
        alert("Data updated successfully!");
      } else {
        await addDoc(coll, updatedFormData);
        alert("Data added successfully!");
      }
    } catch (error) {
      console.error("Error uploading details:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await uploadDetails();
  };

  const getDetails = async () => {
    const coll = collection(firestore, "studentData");
    const q = query(coll, where('userId', '==', formData.userId));
    const snapshot = await getDocs(q);

    if (!snapshot.empty) {
      const doc = snapshot.docs[0];
      setFormData({ ...doc.data(), id: doc.id }); // Store the document ID for updating
      setStudentDataExists(true); // Mark that the data exists
    }
  };

  useEffect(() => {
    if (formData.userId) {
      getDetails();
    }
  }, [formData.userId]);


  return (
    <Layout>
      <div className="w-[90%] h-[90%] flex flex-col dark:text-gray-300 text-slate-700">
        <div>
          <h1 className='font-bold text-[2rem] w-full text-center'>Details</h1>
          <form className='mt-5 p-5' onSubmit={handleSubmit}>
            <Stack gap={3} direction={{ sm: "column", lg: "row" }} sx={{ marginBottom: 4 }}>
              <TextField
                required
                value={formData.fullname || ''}
                onChange={handleChange}
                id="fullname"
                label="Full Name"
                sx={textFieldStyles(currentMode)}
              />
              <TextField
                required
                value={formData.rollno || ''}
                onChange={handleChange}
                id="rollno"
                label="Roll No"
                sx={textFieldStyles(currentMode)}
              />
              <TextField
                required
                value={formData.email || ''}
                onChange={handleChange}
                id="email"
                type="email"
                label="Email"
                sx={textFieldStyles(currentMode)}
              />
              <TextField
                value={formData.room || 'Na'}
                id="room"
                label="Room"
                InputProps={{ readOnly: true }}
                sx={textFieldStyles(currentMode)}
              />
              <TextField
                value={formData.department || ''}
                onChange={handleChange}
                id="department"
                type="text"
                label="Department"
                sx={textFieldStyles(currentMode)}
              />
              <TextField
                required
                value={formData.sgpi || ''}
                onChange={handleChange}
                id="sgpi"
                type="number"
                label="SGPI"
                sx={textFieldStyles(currentMode)}
              />
            </Stack>
            <Stack spacing={2} direction={{ sm: "column", lg: "row" }} sx={{ marginBottom: 4 }}>
            <div className='flex gap-3 flex-col'>
              <TextField
                onChange={(e) => setResult(e.target.files[0])}
                id='result'
                label="Result"
                variant="outlined"
                color="secondary"
                type="file"
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyles(currentMode)}
              />
              {formData.resultUrl && (
                <div>
                  <p className='text-blue-500'><a href={formData.resultUrl} target="_blank" rel="noopener noreferrer">View Result</a></p>
                </div>
              )}
              </div>
              <div className='flex gap-3 flex-col'>
                
              <TextField
                onChange={(e) => setFeeReceipt(e.target.files[0])}
                id='feereceipt'
                label="Fee Receipt"
                variant="outlined"
                color="secondary"
                type="file"
                InputLabelProps={{ shrink: true }}
                sx={textFieldStyles(currentMode)}
              />
              {formData.feeUrl && (
                <div>
                  <p className='text-blue-500'><a href={formData.feeUrl} target="_blank" rel="noopener noreferrer">View Fee Receipt</a></p>
                </div>
              )}
              </div>
              <TextField
                id='hostelfee'
                value={formData.hostelfee || ''}
                onChange={handleChange}
                required
                label="Hostel Fee"
                variant="outlined"
                color="secondary"
                type="number"
                sx={textFieldStyles(currentMode)}
              />
              <TextField
                value={formData.referenceno || ''}
                onChange={handleChange}
                required
                id='referenceno'
                label="Reference No"
                variant="outlined"
                color="secondary"
                type="text"
                sx={textFieldStyles(currentMode)}
              />
            </Stack>
            <Button type="submit" variant="contained" color="primary">
              {studentDataExists ? 'Update Details' : 'Submit Details'}
            </Button>
          </form>
        </div>
      </div>
    </Layout>
  );
};

// Styles for the TextField component based on currentMode
const textFieldStyles = (currentMode) => ({
  input: { color: currentMode === 'Light' ? 'black' : '#E0E0E0' },
  "& .MuiInputLabel-root": { color: currentMode === 'Light' ? '#334155' : '#E0E0E0' },
  "& .MuiOutlinedInput-root": {
    borderColor: currentMode === 'Light' ? '#334155' : '#E0E0E0',
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: currentMode === 'Light' ? '#334155' : '#E0E0E0',
    },
    "&.Mui-focused": {
      borderColor: currentMode === 'Light' ? '#334155' : '#E0E0E0',
      '& .MuiOutlinedInput-notchedOutline': {
        borderColor: currentMode === 'Light' ? '#334155' : '#E0E0E0',
      },
    },
  },
});

export default Details;
