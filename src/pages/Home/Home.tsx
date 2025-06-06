import { useRef, useState } from "react";
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from "../../lib/wp";
import HtmlContent from "../../utils/HtmlContent";
import { useQuery } from "@tanstack/react-query";
import Titles from "../../components/Titles/Titles";
import ScrollMenu from "../../components/ScrollMenu/ScrollMenu";
import './Home.scss';
import { Grid, Skeleton, useColorScheme } from '@mui/material';
import CardItem from "../../components/Card/Card";
import { useLanguage } from "../../context/LanguageContext";
import { useEffect } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';

// Register only the plugins you use
gsap.registerPlugin(ScrollTrigger, ScrollSmoother);

export default function Home() {

    const language = useLanguage();
    const isEnglish = language.language === 'en';
    const mode = useColorScheme();
    const isDarkMode = mode.mode === 'dark';
    const [categoryId, setCategoryId] = useState(isEnglish ? 21 : 1);

    useEffect(() => {
        setCategoryId(isEnglish ? 21 : 1);
    }, [isEnglish]);
    const container = useRef(null);
    const box1 = useRef(null);
    const box2 = useRef(null);
    const box3 = useRef(null);
    const box4 = useRef(null);
    const box5 = useRef(null);

    useEffect(() => {
        const sections = [box1, box2, box3, box4, box5];

        sections.forEach((ref, idx) => {
            if (ref.current) {
            // Reset opacity and transform before animating again
            gsap.set(ref.current, { opacity: 1, y: 0 });
            gsap.from(ref.current, {
                scrollTrigger: {
                trigger: ref.current,
                start: "top bottom",
                end: "bottom 80%",
                scrub: true,
                toggleActions: "play reverse reverse reverse reverse",
                },
                opacity: 0,
                y: 90,
                duration: 1,
                ease: "power2.out",
                delay: idx * 0.1,
            });
            }
        });

        return () => {
            ScrollTrigger.getAll().forEach(trigger => trigger.kill());
            gsap.killTweensOf([box1.current, box2.current, box3.current, box4.current, box5.current]);
        };
    }, [ box1, box2, box3, box4, box5 ]);

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
        queryFn: () => getCategories(language.language === 'en' ? 'en' : 'es'), // <--- agrega el idioma aquí,
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

    const handleCategoryId = (catId: number) => setCategoryId(catId);

    const pabloJaraSkills = {
        frontendFrameworks: ["React", "Angular", "Bootstrap"],
        languages: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SCSS", "SASS", "PHP (basic)", "Python (basic)"],

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
        <div ref={container} >

            <section ref={box1} id="main" className={`main hero is-fullheight ${isDarkMode ? 'has-background-dark' : 'has-background-light'}`}>
                <div className="hero-body">
                    {loadingPage ? (
                        <div className="skeleton-block" style={{ height: 300, borderRadius: 8 }} />
                    ) : (

                        <HtmlContent className={'container has-text-centered'} htmlString={main.content} themeMode={isDarkMode} />

                    )}

                </div>
                <div className="hero-foot">
                    <div className="container is-flex is-justify-content-center">
                        <KeyboardArrowDownIcon sx={{ fontSize: 90 }} className="animate" />
                    </div>
                </div>

            </section>

            <section ref={box2} id="about" className={`about hero is-fullheight ${isDarkMode ? 'has-background-black' : 'has-background-grey-lighter'}`}>
                <Titles title={isEnglish ? 'About me' : 'Sobre mi'} color={'has-background-primary'} themeMode={isDarkMode} titleColor={'has-text-primary'} />
                <div className="hero-body is-flex-wrap-wrap">
                    <div className="container is-max-desktop">
                        <HtmlContent className="subtitle is-size-5" htmlString={description.content} themeMode={isDarkMode} />
                    </div>
                </div>
            </section>
            <section ref={box3} id="links" className={`links hero is-fullheight ${isDarkMode ? 'has-background-dark' : 'has-background-light'}`}>
                <Titles title={isEnglish ? 'Links' : 'Enlaces'} color={'has-background-link'} themeMode={isDarkMode} titleColor={'has-text-link'} />
                <div className="hero-body is-flex-wrap-wrap">
                    <div className="container is-max-desktop">
                        <HtmlContent className="subtitle" htmlString={links.content} themeMode={isDarkMode} />
                    </div>
                </div>
            </section>
            <section ref={box4} id="skills" className={`skills hero is-fullheight ${isDarkMode ? 'has-background-black-bis' : 'has-background-grey-lighter'}`}>
                <Titles title="Skills" color={'has-background-info'} themeMode={isDarkMode} titleColor={'has-text-info'} />
                <div className="hero-body is-flex-wrap-wrap">
                    <div className="container is-max-desktop">

                        <div className="skills-list">
                            {Object.entries(pabloJaraSkills).map(([key, value]) => (
                                <div key={key} className="skill-category mb-4">
                                    <p className={`is-size-3 ${isDarkMode ? 'has-text-light' : 'has-text-dark'} has-text-weight-bold`}>
                                        {key
                                            .replace(/([A-Z])/g, ' $1')
                                            .replace(/^./, str => str.toUpperCase())
                                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                                            .replace(/([a-z])([A-Z])/g, '$1 $2')
                                            .replace(/([A-Z][a-z]+)/g, ' $1')
                                            .replace(/\s+/g, ' ')
                                            .trim()}
                                    </p>
                                    <div className="ml-3 mt-2">
                                        {Array.isArray(value) ? (
                                            <ul>
                                                {value.map((item, idx) => (
                                                    <span key={idx} className="tag  is-dark mr-2 mb-2">
                                                        {item}
                                                    </span>
                                                ))}
                                            </ul>
                                        ) : typeof value === 'object' ? (
                                            <ul>
                                                {Object.entries(value).map(([lang, level]) => (
                                                    <span key={lang} className="tag  is-dark mr-2 mb-2">
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
            <section ref={box5} id="exp" className={`exp hero is-fullheight ${isDarkMode ? 'has-background-dark' : 'has-background-light'}`}>
                <Titles title={isEnglish ? 'Experience' : 'Experiencia'} color={'has-background-danger'} themeMode={isDarkMode} titleColor={'has-text-danger'} />
                <div className="container is-max-desktop">
                    <div className="hero-body is-flex-wrap-wrap is-align-content-center">
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
                                                    className={`tag mx-2 has-text-light`}
                                                    onClick={() => handleCategoryId(cat.id)}
                                                >
                                                    {cat.name}
                                                </button>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>




                            <Grid container spacing={{ xs: 2, md: 3 }} columns={{ xs: 4, sm: 6, md: 12 }}>
                                {loadingPosts
                                    ? Array.from({ length: 6 }).map((_, idx) => (
                                        <Grid key={idx} size={{ xs: 12, sm: 3, md: 4 }}>
                                            <div className="cell">
                                                <Skeleton
                                                    sx={{ bgcolor: 'grey.900' }}
                                                    variant="rectangular"
                                                    width={250}
                                                    height={110}
                                                />
                                            </div>
                                        </Grid>
                                    ))


                                    : (posts as any[]).map((post: any) =>

                                        <Grid key={post.id} size={{ xs: 12, sm: 4, md: 4 }}><CardItem {...post} className="cell" isEnglish={isEnglish} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </div>
                    </div>
                </div>
            </section >



        </div>
    )
}
