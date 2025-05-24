import { NavLink, Outlet } from "react-router-dom";
import './Layout.scss';

export default function Layout() {
    return (
        <div className="layout">
            <nav>
                <ul>
                    <li>
                        <NavLink to="/" className={({ isActive }) => (isActive ? 'active' : '')}>Home</NavLink>
                    </li>
                    <li>
                        <NavLink to="/about">About</NavLink>
                    </li>
                </ul>
            </nav>

            <Outlet />
        </div>
    )
}
