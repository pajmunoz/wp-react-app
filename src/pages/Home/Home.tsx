import { useEffect, useMemo, useState } from "react";
import { getPosts } from "../../lib/wp";
import Card from "../../components/Card/Card";

export default function Home() {
    const [posts, setPosts] = useState([])
    useEffect(() => {
        const fetchData = async () => {
            const data = await getPosts({ perPage: 6 });
            //console.log('data', data);
            setPosts(data)
            //console.log('data', data[0]._links['wp:featuredmedia'][0].href);

        };
        fetchData();
    }, []);

    const memoizedPosts = useMemo(() => posts, [posts]);
    return (
        <div className="post_container container">
            {
                memoizedPosts.map((post: any) => <Card key={post.id} {...post} />)
            }
        </div>
    )
}
