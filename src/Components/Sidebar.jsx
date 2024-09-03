import { Link, NavLink } from 'react-router-dom';
import { MdOutlineCancel } from 'react-icons/md';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../Contexts/ContextProvider';
import { RiHotelFill } from "react-icons/ri";
import { links } from '../data/dummy';
import avatar from '../data/avatar.jpg';
import { Button } from '@mui/material';
import { signOut } from 'firebase/auth';
import { auth } from "../Firebase/Config"
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentColor, activeMenu, setActiveMenu, screenSize, user, setUser } = useStateContext();


  const handleCloseSideBar = () => {
    if (activeMenu !== undefined && screenSize <= 900) {
      setActiveMenu(false);
    }
  };

  const activeLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg  text-white  text-md m-2';
  const normalLink = 'flex items-center gap-5 pl-4 pt-3 pb-2.5 rounded-lg text-md text-gray-700 dark:text-gray-200 dark:hover:text-black hover:bg-light-gray m-2';

  const logout = async () => {
    try {
      await signOut(auth);
      setUser({ loggedin: false, name: "", email: "" });
      localStorage.removeItem('user');
      navigate('/signin');
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div className="ml-3 h-screen md:overflow-hidden overflow-auto md:hover:overflow-auto pb-10 border-r-2 dark:border-r-gray-600 border-r-gray-200">
      {activeMenu && (
        <>
          <div className="flex justify-between items-center">
            <Link to="/" onClick={handleCloseSideBar} className="items-center gap-3 ml-3 mt-4 flex text-2xl font-extrabold tracking-tight dark:text-gray-300 text-slate-700">
              <RiHotelFill /> <span >Hostel Allotment</span>
            </Link>

            <TooltipComponent content="Menu" position="BottomCenter">
              <button
                type="button"
                onClick={() => setActiveMenu(!activeMenu)}
                style={{ color: currentColor }}
                className="text-xl rounded-full p-3 hover:bg-light-gray mt-4 block md:hidden"
              >
                <MdOutlineCancel />
              </button>
            </TooltipComponent>
          </div>

          <TooltipComponent content="Profile" position="BottomCenter">
            <div
              className="flex flex-col justify-center w-full items-center gap-2 cursor-pointer  rounded-lg mt-10"
            >
              <img
                className="rounded-full w-28 h-28"
                src={user.loggedin == true ? user.photoURL : avatar}
                alt="user-profile"
              />
              <p className='dark:text-gray-300 text-slate-700 font-semibold tracking-widest text-[1rem] mt-2'>
                <span>Hi,</span>{' '}
                <span className="ml-1">
                  {user.name}
                </span>
              </p>
              {
                user.loggedin && <Button onClick={logout}>Logout</Button>
              }
            </div>
          </TooltipComponent>

          <div>
            {links.map((item) => (
              <div key={item.title}>
                <p className="text-gray-400 dark:text-gray-400 m-3 mt-4 uppercase">
                  {item.title}
                </p>
                {item.links.map((link) => (
                  link.role === user.role &&
                  <NavLink
                    to={`/${link.name}`}
                    key={link.name}
                    onClick={handleCloseSideBar}
                    style={({ isActive }) => ({
                      backgroundColor: isActive ? currentColor : '',
                    })}
                    className={({ isActive }) => (isActive ? activeLink : normalLink)}
                  >
                    {link.icon}
                    <span className="capitalize ">{link.name}</span>
                  </NavLink>

                ))}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};


export default Sidebar
