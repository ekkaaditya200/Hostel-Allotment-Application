import { useEffect } from 'react';
import { RiMenuFoldFill, RiMenuUnfoldFill } from "react-icons/ri";
import { FiSettings } from 'react-icons/fi';
import { TooltipComponent } from '@syncfusion/ej2-react-popups';
import { useStateContext } from '../Contexts/ContextProvider';
import ThemeSettings from './ThemeSettings'
import avatar from '../data/avatar.jpg';
import { auth } from '../Firebase/Config';
const NavButton = ({ title, customFunc, icon, color, dotColor }) => (

    <TooltipComponent content={title} position="BottomCenter">
        <button
            type="button"
            onClick={() => customFunc()}
            style={{ color }}
            className="relative text-xl rounded-full p-3 hover:bg-light-gray"
        >
            <span
                style={{ background: dotColor }}
                className="absolute inline-flex rounded-full h-2 w-2 right-2 top-2"
            />
            {icon}
        </button>
    </TooltipComponent>
);
const Navbar = () => {
    const { currentColor, activeMenu, setActiveMenu, setScreenSize, screenSize, themeSettings, setThemeSettings, user } = useStateContext();
    useEffect(() => {
        const handleResize = () => setScreenSize(window.innerWidth);

        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        if (screenSize <= 900) {
            setActiveMenu(false);
        } else {
            setActiveMenu(true);
        }
    }, [screenSize]);

    const handleActiveMenu = () => setActiveMenu(!activeMenu);

    return (
        <div className="flex justify-between p-2 md:ml-6 md:mr-6 relative">
            {
                activeMenu ? <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={< RiMenuFoldFill />} /> : <NavButton title="Menu" customFunc={handleActiveMenu} color={currentColor} icon={< RiMenuUnfoldFill />} />
            }

            <div className='flex gap-5 justify-center items-center'>
                {!themeSettings && <div style={{ zIndex: '1000' }}>
                    <TooltipComponent
                        content="Settings"
                        position="BottomCenter"
                    >
                        <button
                            type="button"
                            onClick={() => setThemeSettings(true)}
                            style={{ background: currentColor, borderRadius: '50%' }}
                            className="text-xl text-white p-1 hover:drop-shadow-xl hover:bg-light-gray"
                        >
                            <FiSettings />
                        </button>

                    </TooltipComponent>
                </div>
                }
                {!activeMenu && <TooltipComponent content="Profile" position="BottomCenter">
                    <div
                        className="flex items-center gap-2 cursor-pointer p-1 hover:bg-light-gray rounded-lg"
                    >
                        <img
                            className="rounded-full w-8 h-8"
                            src={user.loggedin == true ? user.photoURL : avatar}
                            alt="user-profile"
                        />
                        {
                            user.loggedin == true ?
                                <p>
                                    <span className="text-gray-400 text-14">Hi,</span>{' '}
                                    <span className="text-gray-400 font-bold ml-1 text-14">
                                        {user.name}
                                    </span>
                                </p> : <p>Signin</p>
                        }
                    </div>
                </TooltipComponent>
                }
            </div>
        </div>
    )
}

export default Navbar
