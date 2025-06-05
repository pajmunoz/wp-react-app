import Button from '@mui/material/Button';
import { useColorScheme } from '@mui/material';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeOutlinedIcon from '@mui/icons-material/LightModeOutlined';

export default function LanguageSelect() {
    const { mode, setMode } = useColorScheme();

    const handleSelect = (theme: "light" | "dark") => {
        setMode(theme);

    };

    return (

        <Button
            id="button2"
            onClick={() => handleSelect(mode === 'light' ? 'dark' : 'light')}
            color={`${mode === 'light' ? 'secondary' : 'primary'}`}
        >
            {mode === 'light' ? <LightModeOutlinedIcon />:<DarkModeIcon /> }
        </Button>

    )
}