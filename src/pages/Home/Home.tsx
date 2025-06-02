import { useState } from "react";
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from "../../lib/wp";
import HtmlContent from "../../utils/HtmlContent";
import { useQuery } from "@tanstack/react-query";
import Titles from "../../components/Titles/Titles";
import ScrollMenu from "../../components/ScrollMenu/ScrollMenu";
import './Home.scss';
import { Grid, Skeleton } from '@mui/material';
import CardItem from "../../components/Card/Card";
import { useLanguage } from "../../context/LanguageContext";


export default function Home() {
    const [categoryId, setCategoryId] = useState(1)
    const language = useLanguage();
    const isEnglish = language.language === 'en';

    // saludo principal
    const { data: main = { content: '' }, isLoading: loadingPage } = useQuery({
        queryKey: ['page', '1main', language.language], // <--- agrega el idioma aquí
        queryFn: () => getPageInfo('1main', language.language)
    });

    const { data: description = { content: '' }, isLoading: loadingDesc } = useQuery({
        queryKey: ['page', '2description', language.language], // <--- agrega el idioma aquí
        queryFn: () => getPageInfo('2description', language.language)
    });

    const { data: links = { content: '' }, isLoading: loadingLinks } = useQuery({
        queryKey: ['page', '3links', language.language], // <--- agrega el idioma aquí
        queryFn: () => getPageInfo('3links', language.language)
    });

    const { data: category = [], isLoading: loadingCat } = useQuery({
        queryKey: ['categories', language.language], // <--- si tus categorías dependen del idioma
        queryFn: getCategories
    });

    const { data: posts = [], isLoading: loadingPosts } = useQuery({
        queryKey: ['posts', categoryId, language.language], // <--- agrega el idioma aquí
        queryFn: () =>
            categoryId
                ? getCategoryPosts(categoryId, language.language).then(response =>
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
                : getPosts({ perPage: 6, lang: language.language }),
    });
    // const scrollTo = (section:string) => {
    //     smoother.current.scrollTo(section, true, 'center center');
    // };

    const handleCategoryId = (catId: number) => setCategoryId(catId);

    const pabloJaraSkills = {
        languages: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SCSS", "SASS", "PHP (basic)", "Python (basic)"],
        frontendFrameworks: ["React", "Angular", "Bootstrap"],
        backendTechnologies: ["Node.js", "Firebase", "MongoDB", "PostgreSQL", "DBeaver"],
        toolsAndDevOps: ["Git", "GitHub", "GitLab", "NPM", "Webpack", "Gulp", "Grunt", "Azure DevOps"],
        testing: ["Jest", "Testing Library", "SonarQube"],
        cmsExperience: ["WordPress", "Sitecore", "Custom CMS"],
        uiUxDesign: ["Figma", "Adobe Photoshop", "Illustrator", "Adobe XD"],
        softSkills: ["Problem-solving", "Teamwork", "Flexibility", "Communication", "Self-learning"],
        methodologies: ["Agile", "Scrum", "Kanban"],
        languagesSpoken: {
            spanish: "Native",
            english: "Advanced - Professional proficiency"
        }
    };

    return (
        <>
            <ScrollMenu />
            <section id="main" className="main hero is-fullheight">
                <div className="hero-body">
                    {loadingPage ? (
                        <div className="skeleton-block" style={{ height: 300, borderRadius: 8 }} />
                    ) : (

                        <HtmlContent className={'container has-text-centered'} htmlString={main.content} />

                    )}
                </div>
            </section>

            <section id="about" className="about hero is-fullheight has-background-black">
                <div className="container is-max-desktop">
                    <div className="hero-body is-flex-wrap-wrap">
                        <Titles title={isEnglish?'About me':'Acerca de mi'} color={'has-background-primary'} />
                        <HtmlContent className="subtitle" htmlString={description.content} />
                    </div>
                </div>
            </section>

            <section id="links" className="links hero is-fullheight">
                
                    <div className="hero-body is-flex-wrap-wrap">
                        <div className="container is-max-desktop">
                        <Titles title={isEnglish?'Links':'Enlaces'} color={'has-background-link'} />
                        <HtmlContent className="subtitle" htmlString={links.content} />
                    </div>
                </div>
            </section>

            <section id="skills" className="skills hero is-fullheight has-background-grey">
                <div className="container is-max-desktop">
                    <div className="hero-body is-flex-wrap-wrap">
                        <Titles title="Skills" color={'has-background-info'} />
                        <div className="skills-list">
                            {Object.entries(pabloJaraSkills).map(([key, value]) => (
                                <div key={key} className="skill-category mb-4">
                                    <strong className="is-size-5 has-text-info">
                                        {key
                                            .replace(/([A-Z])/g, ' $1')
                                            .replace(/^./, str => str.toUpperCase())
                                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                                            .replace(/([A-Z][a-z]+)/g, ' $1')
                                            .replace(/\s+/g, ' ')
                                            .trim()}
                                    </strong>
                                    <div className="ml-3 mt-2">
                                        {Array.isArray(value) ? (
                                            <ul>
                                                {value.map((item, idx) => (
                                                    <span key={idx} className="tag is-info is-light mr-2 mb-2">
                                                        {item}
                                                    </span>
                                                ))}
                                            </ul>
                                        ) : typeof value === 'object' ? (
                                            <ul>
                                                {Object.entries(value).map(([lang, level]) => (
                                                    <span key={lang} className="tag is-info is-light mr-2 mb-2">
                                                        <span>{lang.charAt(0).toUpperCase() + lang.slice(1)}:</span> {level}
                                                    </span>
                                                ))}
                                            </ul>
                                        ) : (
                                            <span>{value}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            <section id="clients" className="clients hero is-fullheight">
                <div className="container is-max-desktop">
                    <div className="hero-body is-flex-wrap-wrap is-align-content-center">
                        <Titles title={isEnglish?'Clients':'Clientes'} color={'has-background-danger'} />
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




                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                                {loadingPosts
                                    ? Array.from({ length: 6 }).map((_, idx) => (
                                        <Grid key={idx} size={{ xs: 2, sm: 3, md: 3 }}>
                                            <div className="cell">
                                                <Skeleton
                                                    sx={{ bgcolor: 'grey.900' }}
                                                    variant="rectangular"
                                                    width={198}
                                                    height={290}
                                                />
                                            </div>
                                        </Grid>
                                    ))


                                    : (posts as any[]).map((post: any) =>

                                        <Grid key={post.id} size={{ xs: 2, sm: 3, md: 3 }}><CardItem {...post} className="cell" isEnglish={isEnglish} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </div>
                    </div>
                </div>
            </section >



        </>
    )
}
