import { useState, useRef } from "react";
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from "../../lib/wp";
import Card from "../../components/Card/Card";
import HtmlContent from "../../utils/HtmlContent";
import { useQuery } from "@tanstack/react-query";


export default function Home() {
    const [categoryId, setCategoryId] = useState(1)

    // Página principal
    const { data: page = { content: '' }, isLoading: loadingPage } = useQuery({
        queryKey: ['page', 'home'],
        queryFn: () => getPageInfo('home')
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
                        excerpt: post.excerpt?.rendered ?? post.excerpt,
                        content: post.content?.rendered ?? post.content,
                        featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url ?? null,
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
        <div id="smooth-wrapper">
            <div id="smooth-content">
                <HtmlContent className="section_one" htmlString={page.content} data-speed="0.5" />

                <div className="section_two" data-speed="0.8">
                    <section id="skills" className="skills">
                        <h3>Skills.</h3>
                        <ul className="category">
                            {category.map((cat: any) => (
                                <li key={cat.id} className={categoryId === cat.id ? "active" : ""}>
                                    <a onClick={() => handleCategoryId(cat.id)}>{cat.name}</a>
                                </li>
                            ))}
                        </ul>
                        <div className="post_container container">
                            {loadingPosts
                                ? <div>Cargando...</div>
                                : (posts as any[]).map((post: any) => <Card key={post.id} {...post} />)
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
