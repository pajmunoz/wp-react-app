import { formattedDate } from "../utils/formatDate";
import { config, getApiUrl, log, validateConfig } from "../config/environment";
import { rateLimitedFetch } from "./rateLimiter";

// Validar configuración al importar
validateConfig();

// Función helper para manejar errores de fetch
const handleFetchError = (error: any, endpoint: string) => {
    log.error(`Error en ${endpoint}:`, error);
    if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
        throw new Error(`No se pudo conectar con la API de WordPress. Verifica que ${config.wpDomain} esté disponible.`);
    }
    if (error.message.includes('ERR_INSUFFICIENT_RESOURCES')) {
        throw new Error(`El servidor está sobrecargado. Intenta de nuevo en unos momentos.`);
    }
    throw error;
};

export const getPageInfo = async (slug: string, language: string) => {
    try {
        const url = `${getApiUrl()}/pages?slug=${language === "en" ? slug : slug + "_es"}&lang=${language}`;
        log.debug(`Fetching page: ${url}`);
        
        const response = await rateLimitedFetch(url);
        if (!response.ok) {
            log.error("Error fetching page info:", response.statusText);
            throw new Error(`Failed to fetch page info: ${response.statusText}`);
        }
        const [data] = await response.json();
        const { title: { rendered: title }, content: { rendered: content } } = data;

        return { title, content };
    } catch (error) {
        handleFetchError(error, `getPageInfo(${slug}, ${language})`);
    }
}

export const getPosts = async ({ perPage = 10, lang }: { perPage?: number, lang: string }) => {
    try {
        const response = await rateLimitedFetch(`${getApiUrl()}/posts?per_page=${perPage}&_embed`);
        if (!response.ok) throw new Error(`Error fetching posts: ${response.statusText}`);

        const data = await response.json();
        if (!data.length) throw new Error(`No posts found`);
        log.debug("Fetched posts:", data);

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
    } catch (error) {
        handleFetchError(error, `getPosts(${perPage}, ${lang})`);
    }
}

export const getPostInfo = async (slug?: string, lang?: string) => {
    try {
        // Detecta si el slug ya termina en _es o _en, si no, agrega el sufijo según el idioma
        const response = await rateLimitedFetch(`${getApiUrl()}/posts?slug=${slug}&_embed`);

        if (!response.ok) {
            log.error("Error fetching post info:", response.statusText);
            throw new Error(`Failed to fetch post info: ${response.statusText}`);
        }

        // La respuesta es un objeto, no un array
        const data = await response.json();
        log.debug("Fetched post:", data);
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
        handleFetchError(error, `getPostInfo(${slug}, ${lang})`);
    }
};

export const getCategories = async (lang: string) => {
    try {
        const response = await rateLimitedFetch(`${getApiUrl()}/categories`);
        if (!response.ok) throw new Error(`Error fetching categories: ${response.statusText}`);

        const data = await response.json();
        if (!data.length) throw new Error(`No categories found`);

        const suffix = lang === "en" ? "-en" : "-es";
        const filteredCategories = data.filter((cat: { slug: string }) => cat.slug.endsWith(suffix));

        return filteredCategories;
    } catch (error) {
        handleFetchError(error, `getCategories(${lang})`);
    }
}

export const getCategoryPosts = async (id: number, language: string) => {
    try {
        const response = await rateLimitedFetch(`${getApiUrl()}/posts?categories=${id}&_embed`);
        if (!response.ok) throw new Error(`Error fetching posts: ${response.statusText}`);

        const data = await response.json();
        if (!data.length) throw new Error(`No posts found`);

        const spanishPosts = data.filter((post: { slug: string }) => post.slug.endsWith(`_${language}`));

        return spanishPosts;
    } catch (error) {
        handleFetchError(error, `getCategoryPosts(${id}, ${language})`);
    }
}
export const getSlugForLanguage = (slug: string, language: string) => {
    if (language === "en") {
        return slug.endsWith("_en") ? slug : slug.replace(/_es$/, "") + "_en";
    } else if (language === "es") {
        return slug.endsWith("_es") ? slug : slug.replace(/_en$/, "") + "_es";
    }
    return slug;
};