import React, { createContext, useContext, useReducer, ReactNode, useCallback } from 'react';

interface CacheState {
  pages: Record<string, any>;
  categories: Record<string, any[]>;
  posts: Record<string, any[]>;
  categoryPosts: Record<string, any[]>;
  loading: boolean;
  initialized: boolean;
}

type CacheAction =
  | { type: 'SET_PAGES'; payload: { key: string; data: any } }
  | { type: 'SET_CATEGORIES'; payload: { key: string; data: any[] } }
  | { type: 'SET_POSTS'; payload: { key: string; data: any[] } }
  | { type: 'SET_CATEGORY_POSTS'; payload: { key: string; data: any[] } }
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_INITIALIZED'; payload: boolean }
  | { type: 'CLEAR_CACHE' };

const initialState: CacheState = {
  pages: {},
  categories: {},
  posts: {},
  categoryPosts: {},
  loading: false,
  initialized: false,
};

const cacheReducer = (state: CacheState, action: CacheAction): CacheState => {
  switch (action.type) {
    case 'SET_PAGES':
      return {
        ...state,
        pages: {
          ...state.pages,
          [action.payload.key]: action.payload.data,
        },
      };
    case 'SET_CATEGORIES':
      return {
        ...state,
        categories: {
          ...state.categories,
          [action.payload.key]: action.payload.data,
        },
      };
    case 'SET_POSTS':
      return {
        ...state,
        posts: {
          ...state.posts,
          [action.payload.key]: action.payload.data,
        },
      };
    case 'SET_CATEGORY_POSTS':
      return {
        ...state,
        categoryPosts: {
          ...state.categoryPosts,
          [action.payload.key]: action.payload.data,
        },
      };
    case 'SET_LOADING':
      return {
        ...state,
        loading: action.payload,
      };
    case 'SET_INITIALIZED':
      return {
        ...state,
        initialized: action.payload,
      };
    case 'CLEAR_CACHE':
      return initialState;
    default:
      return state;
  }
};

interface CacheContextType {
  state: CacheState;
  dispatch: React.Dispatch<CacheAction>;
  getCachedPage: (key: string) => any;
  getCachedCategories: (key: string) => any[];
  getCachedPosts: (key: string) => any[];
  getCachedCategoryPosts: (key: string) => any[];
  setCachedPage: (key: string, data: any) => void;
  setCachedCategories: (key: string, data: any[]) => void;
  setCachedPosts: (key: string, data: any[]) => void;
  setCachedCategoryPosts: (key: string, data: any[]) => void;
}

const CacheContext = createContext<CacheContextType | undefined>(undefined);

export const CacheProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(cacheReducer, initialState);

  const getCachedPage = useCallback((key: string) => state.pages[key], [state.pages]);
  const getCachedCategories = useCallback((key: string) => state.categories[key], [state.categories]);
  const getCachedPosts = useCallback((key: string) => state.posts[key], [state.posts]);
  const getCachedCategoryPosts = useCallback((key: string) => state.categoryPosts[key], [state.categoryPosts]);

  const setCachedPage = useCallback((key: string, data: any) => {
    dispatch({ type: 'SET_PAGES', payload: { key, data } });
  }, [dispatch]);

  const setCachedCategories = useCallback((key: string, data: any[]) => {
    dispatch({ type: 'SET_CATEGORIES', payload: { key, data } });
  }, [dispatch]);

  const setCachedPosts = useCallback((key: string, data: any[]) => {
    dispatch({ type: 'SET_POSTS', payload: { key, data } });
  }, [dispatch]);

  const setCachedCategoryPosts = useCallback((key: string, data: any[]) => {
    dispatch({ type: 'SET_CATEGORY_POSTS', payload: { key, data } });
  }, [dispatch]);

  const value: CacheContextType = {
    state,
    dispatch,
    getCachedPage,
    getCachedCategories,
    getCachedPosts,
    getCachedCategoryPosts,
    setCachedPage,
    setCachedCategories,
    setCachedPosts,
    setCachedCategoryPosts,
  };

  return <CacheContext.Provider value={value}>{children}</CacheContext.Provider>;
};

export const useCache = () => {
  const context = useContext(CacheContext);
  if (context === undefined) {
    throw new Error('useCache must be used within a CacheProvider');
  }
  return context;
}; 