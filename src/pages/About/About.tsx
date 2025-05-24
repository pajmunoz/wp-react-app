
import { useEffect, useState } from 'react';
import { getPageInfo } from '../../lib/wp'
import HtmlContent from '../../utils/HtmlContent'


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
        <div className="about container">
            <HtmlContent htmlString={page.title} />
            <HtmlContent htmlString={page.content} />
        </div>
    );
}