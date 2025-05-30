import { useEffect, useState } from "react";
import HtmlContent from "../../utils/HtmlContent";
import { getPostInfo } from "../../lib/wp";
import { useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";

export default function Detail() {
    const [postInfo, setPostInfo] = useState({ title: '', date: '', content: '', featuredImage: '#', slug: '' })
    const { slug } = useParams()
    useEffect(() => {
        const fetchData = async () => {
            //console.log('slug', slug);
            const data = await getPostInfo(slug);
            //console.log('data', data);
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
    return (<>
        {
            <>
                <section className="hero is-small is-primary">
                    <div className="hero-body">
                        <h1 className="title">Projects</h1>
                        <p>{!postInfo.date ? <Skeleton animation="wave" /> : postInfo.date}</p>
                        {!postInfo.title ? <Skeleton animation="wave" /> : <h1 className="has-text-weight-bold">{postInfo.title}</h1>}
                    </div>
                </section>
                <section className="section is-small">
                    <h1 className="has-text-weight-bold">
                        {!postInfo.content ? <Skeleton animation="wave" /> : <HtmlContent htmlString={postInfo.content} />}
                    </h1>

                    {!postInfo.title ? <Skeleton variant="rectangular" width="100%">
                        <div style={{ paddingTop: '57%' }} />
                    </Skeleton> :
                        <figure className="image is-2by1">
                            <img className="post_image" src={postInfo.featuredImage} alt={postInfo.title} />
                        </figure>}

                </section>
            </>
        }
    </>
    )
}
