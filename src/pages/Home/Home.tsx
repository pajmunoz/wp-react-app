import { useState, useRef } from "react";
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from "../../lib/wp";
import Card from "../../components/Card/Card";
import HtmlContent from "../../utils/HtmlContent";
import { useQuery } from "@tanstack/react-query";
import Titles from "../../components/Titles/Titles";
import ScrollMenu from "../../components/ScrollMenu/ScrollMenu";
import './Home.scss';


export default function Home() {
    const [categoryId, setCategoryId] = useState(1)

    // saludo principal
    const { data: main = { content: '' }, isLoading: loadingPage } = useQuery({
        queryKey: ['page', '1main'],
        queryFn: () => getPageInfo('1main')
    });
    // acerca de
    const { data: description = { content: '' }, isLoading: loadingDesc } = useQuery({
        queryKey: ['page', '2description'],
        queryFn: () => getPageInfo('2description')
    });
    // links
    const { data: links = { content: '' }, isLoading: loadingLinks } = useQuery({
        queryKey: ['page', '3links'],
        queryFn: () => getPageInfo('3links')
    });

    // Categorías
    const { data: category = [], isLoading: loadingCat } = useQuery({
        queryKey: ['categories'],
        queryFn: getCategories
    });

    const { data: posts = [], isLoading: loadingPosts } = useQuery({
        queryKey: ['posts', categoryId],
        queryFn: () =>
            categoryId
                ? getCategoryPosts(categoryId).then(response =>
                    response.map((post: any) => ({
                        ...post,
                        title: post.title?.rendered ?? post.title,
                        date: post.date?.rendered ?? post.date,
                        excerpt: post.excerpt?.rendered ?? post.excerpt,
                        content: post.content?.rendered ?? post.content,
                        featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.media_details.sizes.medium.source_url ?? null,
                        slug: post.slug,
                    }))
                )
                : getPosts({ perPage: 6 }),
    });
    // const scrollTo = (section:string) => {
    //     smoother.current.scrollTo(section, true, 'center center');
    // };

    const handleCategoryId = (catId: number) => setCategoryId(catId);

    return (
        <div className="container is-max-desktop">
            <ScrollMenu />
            <section id="main" className="main hero is-large">
                <div className="hero-body">
                    {loadingPage ? (
                        <div className="skeleton-block" style={{ height: 300, borderRadius: 8 }} />
                    ) : (

                        <HtmlContent className={'container has-text-centered'} htmlString={main.content} />

                    )}
                </div>
            </section>

            <section id="about" className="about hero is-fullheight">
                <div className="hero-body is-flex-wrap-wrap">
                    <Titles title="About Me" color={'has-background-primary'} />
                    <HtmlContent className="subtitle" htmlString={description.content} />
                </div>
            </section>

            <section id="links" className="links hero is-fullheight">

                <div className="hero-body is-flex-wrap-wrap">
                    <Titles title="Links" color={'has-background-link'} />
                    <HtmlContent className="subtitle" htmlString={links.content} />
                </div>
            </section>

            <section id="skills" className="skills hero is-fullheight">

                <div className="hero-body is-flex-wrap-wrap is-align-content-center">
                    <Titles title="Skills" color={'has-background-info'} />
                    <div className="content">
                        <div className="subtitle">
                            {loadingCat ? (
                                <div className="is-flex is-justify-content-center">
                                    {Array.from({ length: 5 }).map((_, idx) => (
                                        <div key={idx} className="cell">
                                            <div className="tag is-skeleton" style={{ width: 90, height: 25, borderRadius: 8 }} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="is-flex is-justify-content-center">
                                    {category.map((cat: any) => (
                                        <div key={cat.id} className={categoryId === cat.id ? "cell active" : "cell"}>
                                            <button
                                                className={`tag is-link mx-2  ${cat.name === 'Wordpress' ? "is-success" : cat.name === 'Angular' ? "is-primary" : cat.name === 'Sitecore' ? "is-info" : cat.name === 'React' ? "is-danger" : "is-warning"}`}
                                                onClick={() => handleCategoryId(cat.id)}
                                            >
                                                {cat.name}
                                            </button>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>




                        <div className="is-flex is-justify-content-space-around is-flex-wrap-wrap">
                            {loadingPosts
                                ? Array.from({ length: 4 }).map((_, idx) => (

                                    <div key={idx} className="cell skeleton-block" style={{ height: 210, borderRadius: 8 }} />

                                ))
                                : (posts as any[]).map((post: any) =>

                                    <Card {...post} className="cell" key={post.id} />
                                )
                            }
                        </div>
                    </div>
                </div>

            </section>

            <section id="projects" className="projects hero is-fullheight">
                <div className="hero-body is-flex-wrap-wrap">
                    <Titles title="Projects" color={'has-background-danger'} />
                </div>
            </section>

        </div >
    )
}
