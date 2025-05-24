import { useEffect, useMemo, useState } from "react";
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from "../../lib/wp";
import Card from "../../components/Card/Card";
import HtmlContent from "../../utils/HtmlContent";

export default function Home() {
    const [posts, setPosts] = useState([])
    const [page, setPage] = useState({ content: '' })
    const [category, setCategory] = useState([])
    const [categoryId, setCategoryId] = useState(1)
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
            console.log('response', response);
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
        <>

            <HtmlContent className="section_one" htmlString={page.content} />


            <h1>Skills</h1>
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
        </>
    )
}
