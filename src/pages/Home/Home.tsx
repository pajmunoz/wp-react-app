import { useRef, useState } from "react";
import HtmlContent from "../../utils/HtmlContent";
import Titles from "../../components/Titles/Titles";
import './Home.scss';
import { Grid, Skeleton, Typography, useColorScheme } from '@mui/material';
import CardItem from "../../components/Card/Card";
import ContactForm from "../../components/ContactForm/ContactForm";
import { useLanguage } from "../../context/LanguageContext";
import { useWordPressData } from "../../hooks/useWordPressData";
import { FallbackContent } from "../../components/FallbackContent/FallbackContent";
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
    const container = useRef(null);
    const box1 = useRef(null);
    const box2 = useRef(null);
    const box3 = useRef(null);
    const box4 = useRef(null);
    const box5 = useRef(null);
    const box6 = useRef(null);
    const [loadingProgress, setLoadingProgress] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const TOTAL_FRAMES = 83;
        const createURL = (frame: number) => {
            const id = (frame + 1).toString().padStart(2, '0');
            return `https://pablojaramunoz.com/videos/video3webp/${id}.webp`;
        }
        const images: HTMLImageElement[] = [];
        let loadedCount = 0;
        const loadImage = (index: number): Promise<HTMLImageElement> => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                const imageUrl = createURL(index);


                img.onload = () => {
                    loadedCount++;
                    setLoadingProgress((loadedCount / TOTAL_FRAMES) * 100);
                    resolve(img);
                };
                img.onerror = () => {
                    console.error(`Failed to load image ${index + 1}: ${imageUrl}`);
                    reject(new Error(`Failed to load image ${index + 1}: ${imageUrl}`));
                };
                img.src = imageUrl;
            });
        };

        const loadImages = async () => {
            const loadAllImages = async () => {
                try {
                    const imagePromises = Array.from({ length: TOTAL_FRAMES }, (_, index) =>
                        loadImage(index)
                    );

                    const loadedImages = await Promise.all(imagePromises);
                    images.push(...loadedImages);

                    // All images loaded successfully
                    setIsLoading(false);
                    initializeAnimations(images);
                } catch (error) {
                    console.error('Error loading images:', error);
                    setIsLoading(false);
                    // You could show an error message here
                }
            };

            loadAllImages();

            const initializeAnimations = (images: HTMLImageElement[]) => {

                const imageCanvas = {
                    frame: 0,
                }
                const tl = gsap.timeline({
                    defaults: {
                        duration: 2,
                        ease: 'power2.inOut',
                        yoyo: true,
                    },
                });
                tl.to(imageCanvas, {
                    frame: TOTAL_FRAMES - 1,
                    ease: 'none',
                    snap: 'frame',
                    duration: 1,
                    scrollTrigger: {
                        scrub: 0.1,
                    },
                    onUpdate: render,

                })

                function render() {
                    const canvas = document.getElementById('image') as HTMLCanvasElement | null;
                    if (!canvas) return;
                    // Set canvas size if not already set
                    const dpr = window.devicePixelRatio || 1;
                    const desiredWidth = 1800;
                    const desiredHeight = 1000;
                    canvas.width = desiredWidth * dpr;
                    canvas.height = desiredHeight * dpr;

                    const ctx = canvas.getContext('2d');
                    if (ctx) {
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
                        ctx.drawImage(images[imageCanvas.frame], 0, 0, canvas.width, canvas.height);
                    }
                }

                // Start rendering
                render();
            }


            const canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
            const ctx = canvas?.getContext('2d');
            if (canvas && ctx) {
                ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }


            setCategoryId(isEnglish ? 21 : 1);
            const sections = [box1, box2, box3, box4, box5, box6];

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
                gsap.killTweensOf([box1.current, box2.current, box3.current, box4.current, box5.current, box6.current]);
            };
        };
        loadImages();
    }, [box1, box2, box3, box4, box5, box6, isEnglish]);

    const { usePageInfo, useCategories, usePosts, useCategoryPosts, usePreloadCategoryPosts, usePreloadAlternativeLanguage } = useWordPressData();
    
    const { data: main = { content: '' }, isLoading: loadingPage } = usePageInfo('1main');
    const { data: description = { content: '' }, isLoading: loadingDesc } = usePageInfo('2description');
    const { data: links = { content: '' }, isLoading: loadingLinks } = usePageInfo('3links');
    const { data: category = [], isLoading: loadingCat } = useCategories();
    
    // Precargar posts de todas las categorías en segundo plano
    usePreloadCategoryPosts(category);
    
    // Precargar datos del idioma alternativo en segundo plano
    usePreloadAlternativeLanguage();
    
    // Usar posts por categoría si hay categoryId seleccionado, sino usar posts generales
    const { data: categoryPosts = [], isLoading: loadingCategoryPosts } = useCategoryPosts(categoryId);
    const { data: generalPosts = [], isLoading: loadingGeneralPosts } = usePosts(6);
    
    const posts = categoryId ? categoryPosts : generalPosts;
    const loadingPosts = categoryId ? loadingCategoryPosts : loadingGeneralPosts;

    const handleCategoryId = (catId: number) => setCategoryId(catId);

    const pabloJaraSkills = {
        frontendFrameworks: ["React", "Angular", "Bootstrap"],
        languages: ["JavaScript (ES6+)", "TypeScript", "HTML5", "CSS3", "SCSS", "SASS", "PHP (basic)", "Python (basic)"],

        backendTechnologies: ["Node.js", "Firebase", "MongoDB", "PostgreSQL", "DBeaver"],
        toolsAndDevOps: ["Git", "GitHub", "GitLab", "NPM", "Webpack", "Gulp", "Grunt", "Azure DevOps"],
        testing: ["Jest", "Testing Library", "SonarQube"],
        cmsExperience: ["WordPress", "Sitecore", "Custom CMS"],
        GraphicDesignUxUi: ["Figma", "Adobe Photoshop", "Illustrator", "Adobe Creative Suite", "Adobe Premiere Pro", "Adobe After Effects"],
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
                <canvas id="image"></canvas>
                <div className="hero-body">
                    {loadingPage ? (
                        <div className="container is-max-desktop">
                            <Typography variant="h1">
                                <Skeleton animation="wave" />
                            </Typography>

                            <Skeleton animation="wave" />
                            <Skeleton animation="wave" />
                        </div>
                    ) : main.content ? (
                        <div className="container-main" style={{ backgroundColor: `${isDarkMode ? 'rgba(0, 0, 0, 0.5)' : 'rgba(255, 255, 255, 0.5)'}` }}>
                            <HtmlContent className={'has-text-centered'} htmlString={main.content} themeMode={isDarkMode} />
                        </div>
                    ) : (
                        <FallbackContent type="page" isDarkMode={isDarkMode} />
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
                        {loadingDesc ? (
                            <div className="subtitle is-size-5">
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                                <Skeleton animation="wave" />
                            </div>
                        ) : description.content ? (
                            <HtmlContent className="subtitle is-size-5" htmlString={description.content} themeMode={isDarkMode} />
                        ) : (
                            <FallbackContent type="page" isDarkMode={isDarkMode} />
                        )}
                    </div>
                </div>
            </section>
            <section ref={box3} id="links" className={`links hero is-fullheight ${isDarkMode ? 'has-background-dark' : 'has-background-light'}`}>
                <Titles title={isEnglish ? 'Links' : 'Enlaces'} color={'has-background-link'} themeMode={isDarkMode} titleColor={'has-text-link'} />
                <div className="hero-body is-flex-wrap-wrap">
                    <div className="container is-max-desktop">
                        {links.content ? (
                            <HtmlContent className="subtitle" htmlString={links.content} themeMode={isDarkMode} />
                        ) : (
                            <FallbackContent type="page" isDarkMode={isDarkMode} />
                        )}
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
                                        {Array.from({ length: 6 }).map((_, idx) => (
                                            <div key={idx} className="cell">
                                                <div className="tag is-skeleton" style={{ width: 90, height: 25, borderRadius: 8 }} />
                                            </div>
                                        ))}
                                    </div>
                                ) : category.length > 0 ? (
                                    <div className="is-flex is-justify-content-center is-flex-wrap-wrap">
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
                                ) : (
                                    <FallbackContent type="categories" isDarkMode={isDarkMode} />
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


                                    : posts.length > 0 ? (posts as any[]).map((post: any) =>

                                        <Grid key={post.id} size={{ xs: 12, sm: 4, md: 4 }}><CardItem {...post} className="cell" isEnglish={isEnglish} />
                                        </Grid>
                                    ) : (
                                        <Grid size={{ xs: 12 }}>
                                            <FallbackContent type="posts" isDarkMode={isDarkMode} />
                                        </Grid>
                                    )
                                }
                            </Grid>
                        </div>
                    </div>
                </div>
            </section >
            <section ref={box6} id="contact" className={`contact hero is-fullheight ${isDarkMode ? 'has-background-black-bis' : 'has-background-grey-lighter'}`}>
                <Titles title={isEnglish ? 'Contact' : 'Contacto'} color={'has-background-primary'} themeMode={isDarkMode} titleColor={'has-text-primary'} />
                <div className="hero-body is-flex-wrap-wrap is-align-content-center">
                    <ContactForm isDarkMode={isDarkMode} />
                </div>
            </section>



        </div>
    )
}
