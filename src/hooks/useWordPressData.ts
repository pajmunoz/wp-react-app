import { useQuery } from '@tanstack/react-query';
import { getCategories, getCategoryPosts, getPageInfo, getPosts } from '../lib/wp';
import { useCache } from '../context/CacheContext';
import { useLanguage } from '../context/LanguageContext';

export const useWordPressData = () => {
  const { language } = useLanguage();
  const {
    getCachedPage,
    getCachedCategories,
    getCachedPosts,
    getCachedCategoryPosts,
    setCachedPage,
    setCachedCategories,
    setCachedPosts,
    setCachedCategoryPosts,
    state: { initialized },
  } = useCache();

  // Hook para obtener información de páginas con caché
  const usePageInfo = (slug: string) => {
    const cacheKey = `${slug}_${language}`;
    const cachedData = getCachedPage(cacheKey);

    return useQuery({
      queryKey: ['page', slug, language],
      queryFn: async () => {
        // Si ya tenemos datos en caché, los devolvemos inmediatamente
        if (cachedData) {
          return cachedData;
        }
        
        const data = await getPageInfo(slug, language);
        setCachedPage(cacheKey, data);
        return data;
      },
      enabled: initialized, // Solo ejecutar cuando la app esté inicializada
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 10 * 60 * 1000, // 10 minutos
    });
  };

  // Hook para obtener categorías con caché
  const useCategories = () => {
    const cacheKey = `categories_${language}`;
    const cachedData = getCachedCategories(cacheKey);

    return useQuery({
      queryKey: ['categories', language],
      queryFn: async () => {
        if (cachedData) {
          return cachedData;
        }
        
        const data = await getCategories(language);
        setCachedCategories(cacheKey, data);
        return data;
      },
      enabled: initialized,
      staleTime: 10 * 60 * 1000, // 10 minutos
      gcTime: 30 * 60 * 1000, // 30 minutos
    });
  };

  // Hook para obtener posts con caché
  const usePosts = (perPage: number = 6) => {
    const cacheKey = `posts_${perPage}_${language}`;
    const cachedData = getCachedPosts(cacheKey);

    return useQuery({
      queryKey: ['posts', perPage, language],
      queryFn: async () => {
        if (cachedData) {
          return cachedData;
        }
        
        const data = await getPosts({ perPage, lang: language });
        setCachedPosts(cacheKey, data);
        return data;
      },
      enabled: initialized,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos
    });
  };

  // Hook para obtener posts por categoría con caché
  const useCategoryPosts = (categoryId: number) => {
    const cacheKey = `categoryPosts_${categoryId}_${language}`;
    const cachedData = getCachedCategoryPosts(cacheKey);

    return useQuery({
      queryKey: ['categoryPosts', categoryId, language],
      queryFn: async () => {
        if (cachedData) {
          return cachedData;
        }
        
        const data = await getCategoryPosts(categoryId, language);
        const processedData = data.map((post: any) => ({
          ...post,
          title: post.title?.rendered ?? post.title,
          date: post.date?.rendered ?? post.date,
          excerpt: post.excerpt?.rendered ?? post.excerpt,
          content: post.content?.rendered ?? post.content,
          featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.media_details.sizes.medium.source_url ?? null,
          slug: post.slug,
        }));
        
        setCachedCategoryPosts(cacheKey, processedData);
        return processedData;
      },
      enabled: initialized && !!categoryId,
      staleTime: 5 * 60 * 1000, // 5 minutos
      gcTime: 15 * 60 * 1000, // 15 minutos
    });
  };

  // Hook para precargar posts de todas las categorías (secuencial para evitar sobrecarga)
  const usePreloadCategoryPosts = (categories: any[]) => {
    const { setCachedCategoryPosts } = useCache();

    return useQuery({
      queryKey: ['preloadCategoryPosts', categories.map(cat => cat.id), language],
      queryFn: async () => {
        const results = [];
        
        // Precargar categorías de forma secuencial para evitar sobrecarga del servidor
        for (const category of categories) {
          const cacheKey = `categoryPosts_${category.id}_${language}`;
          try {
            const data = await getCategoryPosts(category.id, language);
            const processedData = data.map((post: any) => ({
              ...post,
              title: post.title?.rendered ?? post.title,
              date: post.date?.rendered ?? post.date,
              excerpt: post.excerpt?.rendered ?? post.excerpt,
              content: post.content?.rendered ?? post.content,
              featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.media_details.sizes.medium.source_url ?? null,
              slug: post.slug,
            }));
            setCachedCategoryPosts(cacheKey, processedData);
            results.push({ categoryId: category.id, data: processedData, success: true });
            console.log(`✅ Posts de categoría ${category.id} precargados`);
          } catch (error) {
            console.warn(`⚠️ Error precargando posts de categoría ${category.id}:`, error);
            results.push({ categoryId: category.id, data: [], success: false });
          }
        }

        return results;
      },
      enabled: initialized && categories.length > 0,
      staleTime: 10 * 60 * 1000, // 10 minutos
      gcTime: 30 * 60 * 1000, // 30 minutos
    });
  };

  // Hook para precargar datos del idioma alternativo (secuencial para evitar sobrecarga)
  const usePreloadAlternativeLanguage = () => {
    const { setCachedPage, setCachedCategories, setCachedPosts } = useCache();
    const alternativeLanguage = language === 'en' ? 'es' : 'en';

    return useQuery({
      queryKey: ['preloadAlternativeLanguage', alternativeLanguage],
      queryFn: async () => {
        try {
          console.log(`🌍 Precargando datos del idioma alternativo: ${alternativeLanguage}`);
          
          // Precargar páginas del idioma alternativo de forma secuencial
          const pageSlugs = ['1main', '2description', '3links'];
          let successfulPages = 0;
          
          for (const slug of pageSlugs) {
            try {
              const cacheKey = `${slug}_${alternativeLanguage}`;
              const data = await getPageInfo(slug, alternativeLanguage);
              setCachedPage(cacheKey, data);
              successfulPages++;
              console.log(`✅ Página ${slug} en ${alternativeLanguage} precargada`);
            } catch (error) {
              console.warn(`⚠️ Error precargando página ${slug} en ${alternativeLanguage}:`, error);
            }
          }

          // Precargar categorías del idioma alternativo
          let categoriesSuccess = false;
          try {
            const categoriesData = await getCategories(alternativeLanguage);
            const cacheKey = `categories_${alternativeLanguage}`;
            setCachedCategories(cacheKey, categoriesData);
            categoriesSuccess = true;
            console.log(`✅ Categorías en ${alternativeLanguage} precargadas`);
          } catch (error) {
            console.warn(`⚠️ Error precargando categorías en ${alternativeLanguage}:`, error);
          }

          // Precargar posts generales del idioma alternativo
          let postsSuccess = false;
          try {
            const postsData = await getPosts({ perPage: 6, lang: alternativeLanguage });
            const cacheKey = `posts_6_${alternativeLanguage}`;
            setCachedPosts(cacheKey, postsData);
            postsSuccess = true;
            console.log(`✅ Posts en ${alternativeLanguage} precargados`);
          } catch (error) {
            console.warn(`⚠️ Error precargando posts en ${alternativeLanguage}:`, error);
          }

          console.log(`📊 Precarga ${alternativeLanguage}: ${successfulPages}/${pageSlugs.length} páginas, categorías: ${categoriesSuccess ? '✅' : '❌'}, posts: ${postsSuccess ? '✅' : '❌'}`);

          if (successfulPages > 0 || categoriesSuccess || postsSuccess) {
            console.log(`✅ Datos del idioma ${alternativeLanguage} precargados (parcialmente)`);
            return true;
          } else {
            console.warn(`⚠️ No se pudieron precargar datos del idioma ${alternativeLanguage}`);
            return false;
          }
        } catch (error) {
          console.error(`❌ Error crítico precargando datos del idioma ${alternativeLanguage}:`, error);
          return false;
        }
      },
      enabled: initialized,
      staleTime: 30 * 60 * 1000, // 30 minutos
      gcTime: 60 * 60 * 1000, // 1 hora
    });
  };

  return {
    usePageInfo,
    useCategories,
    usePosts,
    useCategoryPosts,
    usePreloadCategoryPosts,
    usePreloadAlternativeLanguage,
  };
}; 