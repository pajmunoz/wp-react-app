import { useEffect, useRef } from 'react';
import { useCache } from '../context/CacheContext';
import { useLanguage } from '../context/LanguageContext';
import { getCategories, getPageInfo, getPosts } from '../lib/wp';

export const useDataPreloader = () => {
  const { language } = useLanguage();
  const { 
    setCachedPage, 
    setCachedCategories, 
    setCachedPosts, 
    dispatch,
    state: { initialized }
  } = useCache();

  // Usar useRef para evitar re-renders innecesarios
  const isPreloading = useRef(false);

  useEffect(() => {
    // Solo ejecutar si no está inicializado y no está precargando
    if (initialized || isPreloading.current) return;

    isPreloading.current = true;

    const preloadData = async () => {
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        console.log('🚀 Iniciando precarga de datos...');
        
        // Precargar páginas principales de forma secuencial
        const pageSlugs = ['1main', '2description', '3links'];
        let successfulPages = 0;
        
        for (const slug of pageSlugs) {
          try {
            const cacheKey = `${slug}_${language}`;
            const data = await getPageInfo(slug, language);
            setCachedPage(cacheKey, data);
            console.log(`✅ Página ${slug} precargada`);
            successfulPages++;
          } catch (error) {
            console.warn(`⚠️ Error precargando página ${slug}:`, error);
          }
        }

        // Precargar categorías
        let categoriesData = [];
        try {
          categoriesData = await getCategories(language);
          const cacheKey = `categories_${language}`;
          setCachedCategories(cacheKey, categoriesData);
          console.log('✅ Categorías precargadas');
        } catch (error) {
          console.warn('⚠️ Error precargando categorías:', error);
        }

        // Precargar posts generales
        let postsData = [];
        try {
          postsData = await getPosts({ perPage: 6, lang: language });
          const cacheKey = `posts_6_${language}`;
          setCachedPosts(cacheKey, postsData);
          console.log('✅ Posts generales precargados');
        } catch (error) {
          console.warn('⚠️ Error precargando posts generales:', error);
        }

        console.log(`📊 Resultado de precarga: ${successfulPages}/${pageSlugs.length} páginas, categorías: ${categoriesData.length > 0 ? '✅' : '❌'}, posts: ${postsData.length > 0 ? '✅' : '❌'}`);

        // Marcar como inicializado
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        dispatch({ type: 'SET_LOADING', payload: false });

        if (successfulPages > 0 || categoriesData.length > 0 || postsData.length > 0) {
          console.log('✅ Datos precargados exitosamente (parcialmente)');
        } else {
          console.warn('⚠️ No se pudieron precargar datos, pero la app continuará funcionando');
        }
      } catch (error) {
        console.error('❌ Error crítico precargando datos:', error);
        dispatch({ type: 'SET_LOADING', payload: false });
        dispatch({ type: 'SET_INITIALIZED', payload: true });
        console.log('🔄 La aplicación continuará funcionando sin datos precargados');
      } finally {
        isPreloading.current = false;
      }
    };

    preloadData();
  }, [language, initialized]); // Solo dependencias esenciales

  return { initialized };
}; 