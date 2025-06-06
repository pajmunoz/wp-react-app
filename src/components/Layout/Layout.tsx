import { NavLink, Outlet } from "react-router-dom";
import './Layout.scss';
import logo from '../../assets/LOG.png'
import { AppBar, Box, Button, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography } from "@mui/material";
import React from "react";
import MenuIcon from '@mui/icons-material/Menu';
import LanguageSelect from "../LanguageSelect/LanguageSelect";
import { useLocation } from 'react-router-dom';
import ThemeSelect from "../ThemeSelect/ThemeSelect";

interface Props {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window?: () => Window;
}

const drawerWidth = 240;
const navItems = ['Home', 'About'];

export default function Layout(props: Props) {
    const { window } = props;
    const [mobileOpen, setMobileOpen] = React.useState(false);
    const location = useLocation();
    const currentPath = location.pathname;

    const handleDrawerToggle = () => {
        setMobileOpen((prevState) => !prevState);
    };

    const drawer = (
        <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
            <Typography variant="h6" sx={{ my: 2 }}>
                PJ
            </Typography>
            <Divider />
            <List>
                {navItems.map((item) => (
                    <ListItem key={item} disablePadding>
                        <ListItemButton sx={{ textAlign: 'center' }}>
                            <ListItemText>
                                <NavLink to={`/${item}`}>{item}</NavLink>
                            </ListItemText>
                        </ListItemButton>
                    </ListItem>
                ))}
                <LanguageSelect />
                <ThemeSelect />
            </List>
        </Box>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (

        <div className="layout">

            <div className="navigation">
                <div className="navBar">
                    <AppBar component="nav">
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                edge="start"
                                onClick={handleDrawerToggle}
                                sx={{ mr: 2, display: { sm: 'none' } }}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography
                                variant="h6"
                                component="div"
                                sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
                            >
                                Pablo🞨Jara
                            </Typography>
                            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
                                {navItems.map((item) => (
                                    <Button
                                        key={item}
                                        variant={currentPath === `/${item}` ? "outlined" : "text"}
                                        sx={{ color: '#fff' }}
                                    >
                                        <NavLink to={`/${item}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                                            {item}
                                        </NavLink>
                                    </Button>
                                ))}
                                <LanguageSelect />
                                <ThemeSelect />
                            </Box>
                        </Toolbar>
                    </AppBar>
                </div>
            </div>
            <nav>
                <Drawer
                    container={container}
                    variant="temporary"
                    open={mobileOpen}
                    onClose={handleDrawerToggle}
                    ModalProps={{
                        keepMounted: true, // Better open performance on mobile.
                    }}
                    sx={{
                        display: { xs: 'block', sm: 'none' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                >
                    {drawer}
                </Drawer>
            </nav>
      
            <Outlet />
        </div>
    )
}
