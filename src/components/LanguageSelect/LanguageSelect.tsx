import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useState } from 'react';
import { useLanguage } from '../../context/LanguageContext';
export default function LanguageSelect() {
    const [anchorEl, setAnchorEl] = useState<HTMLButtonElement | null>(null);
    const { language, setLanguage } = useLanguage();
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };
    const handleSelect = (lang: "en" | "es") => {
        setLanguage(lang);
        handleClose();
    };

    return (
        <>
            <Button
                id="basic-button"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick}
            >
                {language === "en" ? "En" : "Es"}
            </Button>
            <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >

                <MenuItem onClick={() => handleSelect("en")}>EN</MenuItem>
                <MenuItem onClick={() => handleSelect("es")}>ES</MenuItem>
            </Menu>
        </>
    )
}