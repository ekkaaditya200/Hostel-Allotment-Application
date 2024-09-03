import { signInWithPopup } from 'firebase/auth';
import { app, auth, googleProvider } from "../Firebase/Config"
import { getFirestore, collection, query, where, getDocs } from 'firebase/firestore';
import { useStateContext } from '../Contexts/ContextProvider';
import { RiHotelFill } from "react-icons/ri";
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

            if (role === 'student')
                navigate('/room');
            else
                navigate('/students');

        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="bg-custom-image bg-cover bg-center flex justify-center items-center p-10 w-full h-full">

            <h1 className='absolute top-16 flex gap-5 items-center text-gray-800 bg-slate-300 py-3 px-5 rounded-lg border-2 '><span className='text-8xl'><RiHotelFill /></span><span className='font-extrabold tracking-wider text-5xl'>HOSTEL ALLOTMENT</span></h1>
            <button
                className="text-2xl text-white font-semibold bg-slate-500 hover:bg-slate-400 p-4 rounded-lg w-fit h-fit"
                onClick={signInWithGoogle}
            >SIGN IN WITH GOOGLE</button>
        </div>
    )
}

export default SignIn
