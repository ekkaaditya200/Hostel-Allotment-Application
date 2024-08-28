import Sidebar from "./Sidebar"
import Navbar from "./Navbar"
import ThemeSettings from "./ThemeSettings"
import { useStateContext } from '../Contexts/ContextProvider';
import { Outlet } from "react-router-dom";
const Layout = ({children}) => {

    const { activeMenu, themeSettings } = useStateContext();

    return (
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
                   {children}
                </div>
            </div>
        </div>
    )
}

export default Layout
