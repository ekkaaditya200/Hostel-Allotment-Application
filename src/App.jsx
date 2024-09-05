import { useEffect } from 'react';
import { BrowserRouter, Routes, Route} from 'react-router-dom';
import { useStateContext } from './Contexts/ContextProvider';
import Room from './Pages/Students/Room';
import Students from './Pages/Admin/Students';
import Details from './Pages/Students/Details';
import './App.css';
import Booking from './Pages/Admin/Booking';
import SignIn from './Pages/SignIn';
import PrivateRoute from './Components/PrivateRoute';
import AllotedStudents from './Pages/Admin/AllotedStudents';
import MessageList from './Pages/Students/Message';
import SendMessage from './Pages/Admin/SendMessage';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode} = useStateContext();

  useEffect(() => {
    const currentThemeColor = localStorage.getItem('colorMode');
    const currentThemeMode = localStorage.getItem('themeMode');
    if (currentThemeColor && currentThemeMode) {
      setCurrentColor(currentThemeColor);
      setCurrentMode(currentThemeMode);
    }
  }, []);

  return (
    <div className={`h-[100vh] w-[100vw] ${currentMode === 'Dark' ? 'dark' : ''}`}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<SignIn />} />
          <Route path="/signin" element={<SignIn />} />

          <Route path="/room" element={<PrivateRoute element={<Room />} roles={['student']} />} />
          <Route path="/details" element={<PrivateRoute element={<Details />} roles={['student']} />} />
          <Route path="/messages" element={<PrivateRoute element={<MessageList />} roles={['student']} />} />

          <Route path="/students" element={<PrivateRoute element={<Students />} roles={['admin']} />} />
          <Route path="/booking" element={<PrivateRoute element={<Booking />} roles={['admin']} />} />
          <Route path="/alloted-students" element={<PrivateRoute element={<AllotedStudents />} roles={['admin']} />} />
          <Route path="/send-message" element={<PrivateRoute element={<SendMessage />} roles={['admin']} />} />

        </Routes>
      </BrowserRouter>
    </div>
  );
};

export default App;
