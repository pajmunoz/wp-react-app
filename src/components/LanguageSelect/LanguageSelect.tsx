import Button from '@mui/material/Button';
import { useLanguage } from '../../context/LanguageContext';
import { useColorScheme } from '@mui/material';
export default function LanguageSelect() {
    const { language, setLanguage } = useLanguage();

    const { mode, setMode } = useColorScheme();

    const handleSelect = (lang: "en" | "es") => {
        setLanguage(lang);
    };

    return (
        <>
            <Button
                id="basic-button"
                onClick={() => handleSelect(language === 'en' ? 'es' : 'en')}
                color={`${mode === 'light' ? 'secondary' : 'primary'}`}
            >
                {language === "en" ? "En" : "Es"}
            </Button>
        </>
    )
}