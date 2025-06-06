import { Typography, useColorScheme } from '@mui/material';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';


export default function MainBreadcrumbs({ title }: { title?: string }) {
    const mode = useColorScheme();
    const isDarkMode = mode.mode === 'dark';
    const language = useLanguage();
    const isEnglish = language.language === 'en';
    return (<>

        <Breadcrumbs aria-label="breadcrumb">
            <Link
                to="/#exp"
                className={`${isDarkMode ? 'has-text-light' : 'has-text-dark'}`}
            // If you want to use React Router, use the Link component from 'react-router-dom' instead:
            // import { Link as RouterLink } from 'react-router-dom';
            // <Link component={RouterLink} to="/">Volver</Link>
            >
                {`${isEnglish ? 'Back' : 'Volver'}`}
            </Link>

            <Typography sx={{ color: 'text.primary' }}><b>{title}</b></Typography>
        </Breadcrumbs>
    </>
    )
}