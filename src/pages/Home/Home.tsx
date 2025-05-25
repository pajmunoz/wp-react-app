import { useEffect, useMemo, useState, useRef, useLayoutEffect } from "react";
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from "../../lib/wp";
import Card from "../../components/Card/Card";
import HtmlContent from "../../utils/HtmlContent";
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { ScrollSmoother } from 'gsap/ScrollSmoother';
import { useGSAP } from '@gsap/react';


gsap.registerPlugin(useGSAP, ScrollTrigger, ScrollSmoother);
export default function Home() {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState({ content: '' })
    const [category, setCategory] = useState([])
    const [categoryId, setCategoryId] = useState(1)

    const main = useRef<any>([]);
    const smoother = useRef<any>([]);
    // const scrollTo = (section:string) => {
    //     smoother.current.scrollTo(section, true, 'center center');
    // };
    useGSAP(
        () => {
            // create the smooth scroller FIRST!
            smoother.current = ScrollSmoother.create({
                smooth: 5, // seconds it takes to "catch up" to native scroll position
                effects: true, // look for data-speed and data-lag attributes on elements and animate accordingly
            });
            ScrollTrigger.create({
                trigger: '.section_tree',
                pin: true,
                start: 'center center',
                end: '+=300',
                markers: false,
            });
        },
        { scope: main }
    );

    useEffect(() => {
        const fetchData = async () => {
            const data = await getPosts({ perPage: 6 });
            //console.log('data', data);
            setPosts(data)
            //console.log('data', data[0]._links['wp:featuredmedia'][0].href);

        };
        fetchData();
        const fetchHome = async () => {
            const { title, content } = await getPageInfo('home');
            setPage({ content: content })
        };
        fetchHome();
        const fetchCategory = async () => {
            const response = await getCategories();
            setCategory(response);
            //console.log('response', response);
        };
        fetchCategory();
    }, []);
    const handleCategoryId = async (catId: number) => {
        const id = catId;
        setCategoryId(id);
        const response = await getCategoryPosts(id);
        const normalizedPosts = response.map((post: any) => ({
            ...post,
            title: post.title?.rendered ?? post.title,
            excerpt: post.excerpt?.rendered ?? post.excerpt,
            content: post.content?.rendered ?? post.content,
            featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
        }));

        setPosts(normalizedPosts);

    }
    const memoizedPosts = useMemo(() => posts, [posts]);
    return (
        <div id="smooth-wrapper" ref={main}>
            <div id="smooth-content">

                <HtmlContent className="section_one" htmlString={page.content} data-speed="0.5" />

                <div className="section_two" data-speed="0.8">
                    <section id="skills" className="skills">
                        <h3>Skills.</h3>
                        <ul className="category">

                            {
                                category.map((cat: any) => (

                                    <li key={cat.id} className={categoryId === cat.id ? "active" : ""}>
                                        <a onClick={() => handleCategoryId(cat.id)}>{cat.name}</a>
                                    </li>
                                ))
                            }
                        </ul>

                        <div className="post_container container">
                            {
                                memoizedPosts.map((post: any) => <Card key={post.id} {...post} />)
                            }
                        </div>
                    </section>
                </div>
                <div className="section_tree" data-speed="1.5">
                    <section id="projects" className="projects">
                        <h3>Contact.</h3>


                    </section>
                </div>
            </div>
        </div>
    )
}
