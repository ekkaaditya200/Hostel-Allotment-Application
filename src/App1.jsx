import { useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useStateContext } from './Contexts/ContextProvider';
import ThemeSettings from './Components/ThemeSettings';
import Room from './Pages/Students/Room';
import Sidebar from './Components/Sidebar';
import Students from './Pages/Admin/Students';
import Details from './Pages/Students/Details';
import Navbar from './Components/Navbar';
import './App.css';
import Booking from './Pages/Admin/Booking';
import SignIn from './Pages/SignIn';
import PrivateRoute from './Components/PrivateRoute';
import AllotedStudents from './Pages/Admin/AllotedStudents';

const App = () => {
  const { setCurrentColor, setCurrentMode, currentMode, activeMenu, themeSettings, user } = useStateContext();
  console.log(user);


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
        <div className="flex relative dark:bg-main-dark-bg">
          {activeMenu ? (
            <div className="w-72 fixed sidebar dark:bg-secondary-dark-bg bg-white">
              <Sidebar />
            </div>
          ) : (
            <div className="w-0 dark:bg-secondary-dark-bg">
              <Sidebar />
            </div>
          )}

          <div
            className={
              activeMenu
                ? 'dark:bg-main-dark-bg bg-main-bg min-h-screen md:ml-72 w-full'
                : 'bg-main-bg dark:bg-main-dark-bg w-full min-h-screen flex-2'
            }
          >
            <div className="fixed md:static bg-main-bg dark:bg-main-dark-bg navbar w-full">
              <Navbar />
            </div>

            <div className='w-full h-full flex justify-center items-start relative z-1 overflow-auto mt-20 md:mt-0 bg-slate-400'>
              {themeSettings && (<ThemeSettings />)}
              <Routes>

                <Route path="/" element={<Room />} />
                <Route path="/signin" element={<SignIn />} />

                <Route path="/room" element={<PrivateRoute element={<Room />} roles={['student']} />} />
                <Route path="/details" element={<PrivateRoute element={<Details />} roles={['student']} />} />

                <Route path="/students" element={<PrivateRoute element={<Students />} roles={['admin']} />} />
                <Route path="/booking" element={<PrivateRoute element={<Booking />} roles={['admin']} />} />
                <Route path="/alloted-students" element={<PrivateRoute element={<AllotedStudents />} roles={['admin']} />} />

              </Routes>
            </div>
          </div>
        </div>
      </BrowserRouter>
    </div>
  );
};

export default App;