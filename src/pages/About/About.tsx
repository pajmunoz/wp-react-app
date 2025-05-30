
import { useEffect, useState } from 'react';
import { getPageInfo } from '../../lib/wp'
import HtmlContent from '../../utils/HtmlContent'
import { Box, Container } from '@mui/material';


export default function About() {

    const [page, setPage] = useState({ title: '', content: '' })
    useEffect(() => {
        const fetchData = async () => {
            const { title, content } = await getPageInfo('about');
            setPage({ title: title, content: content })
        };
        fetchData();
    }, []);

    return (
        <section className="about hero is-large">
            <div className="hero-body">

                <Container sx={{ my: 2 }}>
                    <h1 className='has-text-weight-extrabold'><HtmlContent htmlString={page.title} /></h1>
                    <Box sx={{ mt: 1 }}><HtmlContent htmlString={page.content} /></Box>
                </Container>
            </div>

        </section>
    );
}