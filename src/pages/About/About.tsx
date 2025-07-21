
import { getPageInfo } from '../../lib/wp'
import HtmlContent from '../../utils/HtmlContent'
import { Box, Container, Skeleton, useColorScheme } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';
import { useQuery } from '@tanstack/react-query';
import MainBreadcrumbs from '../../components/MainBreadcrumbs/MainBreadcrumbs';


export default function About() {
    const language = useLanguage();
    const mode = useColorScheme();
    const isDarkMode = mode.mode === 'dark';

    const { data: detail = { content: '', title: '' }, isLoading: loadingPage } = useQuery({
        queryKey: ['page', 'about', language.language], // <--- agrega el idioma aquí
        queryFn: () => getPageInfo('about', language.language)
    });

    return (
        <section className="hero is-large">

            <div className="hero-body" >
                <MainBreadcrumbs title={loadingPage ? <Skeleton animation="wave" style={{ width: '100px' }} /> : detail.title} />
                {loadingPage ? (
                    <div className="subtitle is-size-5">
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                        <Skeleton animation="wave" />
                    </div>
                ) : (
                    <Container sx={{ my: 2 }}>
                        <h1 className='has-text-weight-extrabold'><HtmlContent htmlString={detail.title} /></h1>
                        <Box sx={{ mt: 1 }}><HtmlContent htmlString={detail.content} /></Box>
                    </Container>
                )}

            </div>

        </section>
    );
}