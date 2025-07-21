import { getPostInfo, getSlugForLanguage } from "../../lib/wp";
import { useParams, useNavigate } from "react-router-dom";
import { Skeleton, useColorScheme } from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { useLanguage } from "../../context/LanguageContext";
import HtmlDetailContent from "../../utils/HtmlDetailContent";
import { useEffect } from "react";
import './Detail.scss';
import MainBreadcrumbs from "../../components/MainBreadcrumbs/MainBreadcrumbs";

export default function Detail() {
    const { slug } = useParams();
    const language = useLanguage();
    const isEnglish = language.language === 'en';
    const navigate = useNavigate();
    const mode = useColorScheme();
    const isDarkMode = mode.mode === 'dark';

    // Cambia el slug en la URL cuando cambia el idioma
    useEffect(() => {
        if (!slug) return;
        const newSlug = getSlugForLanguage(slug, language.language);
        if (newSlug && newSlug !== slug) {
            navigate(`/${newSlug}`, { replace: true });
        }
    }, [language.language, slug, navigate]);

    const { data: post = { content: '', title: '' }, isLoading } = useQuery({
        queryKey: ['postInfo', slug, language.language],
        queryFn: () => getPostInfo(slug, language.language),
        enabled: !!slug,
    });

    return (
        <>
            <section className={`hero is-small is-primary ${isDarkMode ? 'has-text-dark' : 'has-text-light'}`} >
                <div className="hero-body">

                    <h1 className="is-size-2 has-text-darker">{isEnglish ? 'Project' : 'Proyecto'}</h1>
                    <MainBreadcrumbs title={isLoading ? <Skeleton animation="wave" style={{ width: '100px' }} /> : post.title} />
                </div>
            </section>
            <div className={`container is-max-desktop`}>
                <section className="section">
                    <div className="hero-body">
                        <div className="is-size-3">{isEnglish ? 'Experience' : 'Experiencia'}</div>
                        {!post?.content ? <Skeleton variant="rectangular" width="100%">
                            <div style={{ paddingTop: '57%' }} />
                        </Skeleton> : <HtmlDetailContent htmlString={post.content} className={`detail ${post.title}`} />}
                    </div>
                    <em>{isEnglish ? '* Some images may lose quality due to active NDA nor performance' : '* Algunas imagenes pueden perder calidad debido a NDA vigente o por optimización'}</em>
                </section>
            </div>
        </>
    );
}
