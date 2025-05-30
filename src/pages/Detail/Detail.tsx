import { useEffect, useState } from "react";
import HtmlContent from "../../utils/HtmlContent";
import { getPostInfo } from "../../lib/wp";
import { useParams } from "react-router-dom";
import { Skeleton } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContext";

export default function Detail() {
    const { slug } = useParams()
    const language = useLanguage();

    const {  data: post = { content: '', title:'' }, isLoading } = useQuery({
        queryKey: ['postInfo', slug, language.language],
        queryFn: () => getPostInfo(slug, language.language),
        enabled: !!slug,
    });
    return (<>
        {
            <>
                <section className="hero is-small is-primary has-text-dark">
                    <div className="hero-body">
                        <h1 className="title has-text-darker">Projects</h1>
                        {!post?.title ? <Skeleton animation="wave" /> : <h1 className="has-text-weight-bold">{post.title}</h1>}
                    </div>
                </section>
                <section className="section is-small">
                    <h1 className="has-text-weight-bold">
                        {!post?.content ? <Skeleton animation="wave" /> : <HtmlContent htmlString={post.content} />}
                    </h1>

                    {/*!postInfo.title ? <Skeleton variant="rectangular" width="100%">
                        <div style={{ paddingTop: '57%' }} />
                    </Skeleton> :
                        <figure className="image is-2by1">
                            <img className="post_image" src={postInfo.featuredImage} alt={postInfo.title} />
                        </figure>*/}

                </section>
            </>
        }
    </>
    )
}
