import { signInWithPopup } from 'firebase/auth';
import { app, auth, googleProvider } from "../Firebase/Config"
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { Button } from '@mui/material';
import { useStateContext } from '../Contexts/ContextProvider';
import { useNavigate } from 'react-router-dom';
const firestore = getFirestore(app);
const SignIn = () => {
    const { setUser } = useStateContext();
    const navigate = useNavigate();
    
    const signInWithGoogle = async () => {
        try {
            const userCredential = await signInWithPopup(auth, googleProvider);
            const userData = userCredential.user;

            const userObj = {
                loggedin: true,
                userId: userData.uid,
                name: userData.displayName,
                email: userData.email,
                photoURL: userData.photoURL,
                role: ''
            };

            setUser(userObj);

            const coll = collection(firestore, 'users');
            const q = query(coll, where('role', '==', 'admin'), where('userId', '==', userData.uid));
            const snapshot = await getDocs(q);

            const role = !snapshot.empty ? 'admin' : 'student';
            const updatedUserObj = { ...userObj, role };

            setUser(updatedUserObj);

            localStorage.setItem('user', JSON.stringify(updatedUserObj));
            
            if(role==='student')
                navigate('/room');
            else   
                navigate('/students');

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className='flex justify-center p-10'>
            <Button onClick={signInWithGoogle}>Sign In with Google</Button>
        </div>
    )
}

export default SignIn
