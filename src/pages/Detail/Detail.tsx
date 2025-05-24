import { useEffect, useState } from "react";
import HtmlContent from "../../utils/HtmlContent";
import { getPostInfo } from "../../lib/wp";
import { useParams } from "react-router-dom";

export default function Detail() {
    const [postInfo, setPostInfo] = useState({ title: '', date: '', content: '', featuredImage: '#', slug: '' })
    const { slug } = useParams()
    useEffect(() => {
        const fetchData = async () => {
            console.log('slug', slug);
            const data = await getPostInfo(slug);
            console.log('data', data);
            setPostInfo({
                title: data.title || '',
                date: data.Date || '',
                content: data.content || '',
                featuredImage: data.featuredImage || '#',
                slug: data.slug || ''
            });
        };
        fetchData();
    }, [slug]);
    return (
        <div className="container">
            <article className="post_detail">
                <h1 className="post_title">{postInfo.title}</h1>
                <p className="post_date">{postInfo.date}</p>
                <img className="post_image" src={postInfo.featuredImage} alt={postInfo.title} />
                <div className="post_content">
                    <HtmlContent htmlString={postInfo.content} />
                </div>
            </article>
        </div>

    )
}
