import { useState, useEffect, useRef, Children } from 'react';
import { Outlet, useLocation, useNavigate } from "react-router";
import { TbLogout } from "react-icons/tb"
import { FaClipboardList, FaRegUser, FaLock, FaCalendar, FaMicroblog, FaFileExport } from "react-icons/fa"
import { useAuthenticate } from "../authentication/useAuthenticate";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthenticate();

  return <main className="max-w-[430px] min-h-screen mx-auto shadow bg-sky-200 text-white font-medium">
        <header className='text-white'>
            <div className="navbar justify-between bg-base-100 shadow-sm bg-sky-300">
                <button onClick={() => navigate("/")} className="btn btn-ghost text-xl">
                    Highstreet Gym
                </button>

                {user ? <button onClick={() => {logout(); navigate("/authenticate")}} className="btn btn-ghost text-xl">
                    <TbLogout />
                </button> : <button onClick={() => navigate("/authenticate")} className="btn btn-ghost text-xl">
                    <FaLock />
                </button>}
            </div>
        </header>

        <Outlet />
        {user ? 
        <nav className="dock max-w-[430px] mx-auto bg-sky-300">
            <button onClick={() => navigate("/sessions")} className={location.pathname.startsWith("/sessions") ? "dock-active" : ""}>
                <FaCalendar className="text-2xl" />
                <span className="dock-label">Sessions</span>
            </button>

            <button onClick={() => navigate("/profile")} className={location.pathname == "/profile" ? "dock-active" : ""}>
                <FaRegUser className="text-2xl" />
                <span className="dock-label">Profile</span>
            </button>
            
            <button onClick={() => navigate("/posts")} className={location.pathname.startsWith("/posts") ? "dock-active" : ""}>
                <FaMicroblog className="text-2xl" />
                <span className="dock-label">Posts</span>
            </button>

            <button onClick={() => navigate("/export")} className={location.pathname.startsWith("/profile/posts") ? "dock-active" : ""}>
                <FaFileExport className="text-2xl" />
                <span className="dock-label">Export</span>
            </button>
        </nav>:
        null
        }
        
  </main>
};

{/* <button disabled={!(user && user.role == "admin")} onClick={() => navigate("/staff/orders")} 
className={location.pathname.startsWith("/staff/orders") ? "dock-active" : ""}>
    <FaClipboardList className="text-2xl" />
    <span className="dock-label">Orders</span>
</button> */}

export default Layout;