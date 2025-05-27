import { NavLink, Outlet } from "react-router-dom";
import './Layout.scss';
import logo from '../../assets/LOG.png'

export default function Layout() {
    return (

        <div className="layout">
            <nav className="navbar" role="navigation" aria-label="main navigation">
                <div className="navbar-brand">
                    <a className="navbar-item" href="https://pablojaramunoz.com">
                        <img src={logo} alt="logo" />

                    </a>

                    <a role="button" className="navbar-burger" aria-label="menu" aria-expanded="false" data-target="navbarBasicExample">
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                        <span aria-hidden="true"></span>
                    </a>
                </div>

                <div id="navbarBasicExample" className="navbar-menu">
                    <div className="navbar-start">

                        <NavLink to="/" className={({ isActive }) => (isActive ? 'navbar-item active' : 'navbar-item')}>Home</NavLink>




                        <NavLink className="navbar-item" to="/about">About</NavLink>



                    </div>

                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="buttons">
                                <a className="button is-primary">
                                    <strong>Sign up</strong>
                                </a>
                                <a className="button is-light">
                                    Log in
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
            <Outlet />
        </div>
    )
}
