import { formattedDate } from "../utils/formatDate";
const domain = process.env.REACT_APP_WP_DOMAIN;
const apiUrl = `${domain}/wp-json/wp/v2`;

//console.log("WordPress domain:", domain);

export const getPageInfo = async (slug: string, language: string) => {

    const response = await fetch(`${apiUrl}/pages?slug=${language === "en" ? slug : slug + "_es"}&lang=${language}`);
    if (!response.ok) {
        console.error("Error fetching page info:", response.statusText);
        throw new Error(`Failed to fetch page info: ${response.statusText}`);
    }
    const [data] = await response.json();
    const { title: { rendered: title }, content: { rendered: content } } = data;

    return { title, content };
}

export const getPosts = async ({ perPage = 10, lang }: { perPage?: number, lang: string }) => {
    const response = await fetch(`${apiUrl}/posts?per_page=${perPage}&_embed`);
    if (!response.ok) throw new Error(`Error fetching posts: ${response.statusText}`);

    const data = await response.json();
    if (!data.length) throw new Error(`No posts found`);
    //console.log("Fetched posts:", data);

    const posts = data.map((post: {
        _embedded: any; title: { rendered: any; }; excerpt: { rendered: any; }; content: { rendered: any; }; date: any; slug: any; id: number
    }) => {

        const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;

        const {
            id,
            title: { rendered: title },
            excerpt: { rendered: excerpt },
            content: { rendered: content },
            date,
            slug } = post;
        const Date = formattedDate(date);
        return {
            id,
            featuredImage,
            title,
            excerpt,
            content,
            Date,
            slug,
        };
    });

    return posts;
}

export const getPostInfo = async (slug?: string, lang?: string) => {
    // Detecta si el slug ya termina en _es o _en, si no, agrega el sufijo según el idioma
    const response = await fetch(`${apiUrl}/posts?slug=${slug}&_embed`);
    try {


        if (!response.ok) {
            console.error("Error fetching post info:", response.statusText);
            throw new Error(`Failed to fetch post info: ${response.statusText}`);
        }

        // La respuesta es un objeto, no un array
        const data = await response.json();
        //console.log("Fetched post:", data);
        const post = data[0];
        // Extraer datos con validación

        const featuredImage = post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null;
        const {
            title: { rendered: title } = { rendered: "" },
            date,
            content: { rendered: content } = { rendered: "" },
            slug: postSlug,
        } = post;

        const Date = formattedDate(date);


        return { title, Date, content, featuredImage, slug: postSlug };
    } catch (error) {
        console.error("Error in getPostInfo:", error);
        throw error;
    }
};

export const getCategories = async (lang: string) => {
    const response = await fetch(`${apiUrl}/categories`);
    if (!response.ok) throw new Error(`Error fetching categories: ${response.statusText}`);

    const data = await response.json();
    if (!data.length) throw new Error(`No categories found`);

    const suffix = lang === "en" ? "-en" : "-es";
    const filteredCategories = data.filter((cat: { slug: string }) => cat.slug.endsWith(suffix));

    return filteredCategories;
}

export const getCategoryPosts = async (id: number, language: string) => {
    const response = await fetch(`${apiUrl}/posts?categories=${id}&_embed`);
    if (!response.ok) throw new Error(`Error fetching posts: ${response.statusText}`);

    const data = await response.json();
    if (!data.length) throw new Error(`No posts found`);

    const spanishPosts = data.filter((post: { slug: string }) => post.slug.endsWith(`_${language}`));

    return spanishPosts;
}
export const getSlugForLanguage = (slug: string, language: string) => {
    if (language === "en") {
        return slug.endsWith("_en") ? slug : slug.replace(/_es$/, "") + "_en";
    } else if (language === "es") {
        return slug.endsWith("_es") ? slug : slug.replace(/_en$/, "") + "_es";
    }
    return slug;
};