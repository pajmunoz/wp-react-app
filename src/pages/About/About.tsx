
import { getPageInfo } from '../../lib/wp'
import HtmlContent from '../../utils/HtmlContent'
import { Box, Container } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';


export default function About() {
        const language = useLanguage();

    const { data: detail = { content: '', title:''}, isLoading: loadingPage } = useQuery({
        queryKey: ['page', 'about', language.language], // <--- agrega el idioma aquí
        queryFn: () => getPageInfo('about', language.language)
    });

    return (
        <section className="about hero is-large">
            <div className="hero-body">

                <Container sx={{ my: 2 }}>
                    <h1 className='has-text-weight-extrabold'><HtmlContent htmlString={detail.title} /></h1>
                    <Box sx={{ mt: 1 }}><HtmlContent htmlString={detail.content} /></Box>
                </Container>
            </div>

        </section>
    );
}