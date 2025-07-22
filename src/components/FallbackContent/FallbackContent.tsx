import React from 'react';
import { Typography, Box, Alert } from '@mui/material';
import { useLanguage } from '../../context/LanguageContext';

interface FallbackContentProps {
  type: 'page' | 'posts' | 'categories';
  isDarkMode?: boolean;
}

export const FallbackContent: React.FC<FallbackContentProps> = ({ type, isDarkMode = false }) => {
  const { language } = useLanguage();
  const isEnglish = language === 'en';

  const getFallbackContent = () => {
    switch (type) {
      case 'page':
        return {
          title: isEnglish ? 'Content Not Available' : 'Contenido No Disponible',
          message: isEnglish 
            ? 'The content is currently not available. Please check your connection and try again.'
            : 'El contenido no está disponible actualmente. Por favor verifica tu conexión e intenta de nuevo.',
          icon: '📄'
        };
      case 'posts':
        return {
          title: isEnglish ? 'No Posts Available' : 'No Hay Publicaciones Disponibles',
          message: isEnglish
            ? 'Posts are not available at the moment. Please check your connection and try again.'
            : 'Las publicaciones no están disponibles en este momento. Por favor verifica tu conexión e intenta de nuevo.',
          icon: '📝'
        };
      case 'categories':
        return {
          title: isEnglish ? 'No Categories Available' : 'No Hay Categorías Disponibles',
          message: isEnglish
            ? 'Categories are not available at the moment. Please check your connection and try again.'
            : 'Las categorías no están disponibles en este momento. Por favor verifica tu conexión e intenta de nuevo.',
          icon: '📂'
        };
      default:
        return {
          title: isEnglish ? 'Content Not Available' : 'Contenido No Disponible',
          message: isEnglish
            ? 'The requested content is not available.'
            : 'El contenido solicitado no está disponible.',
          icon: '❓'
        };
    }
  };

  const content = getFallbackContent();

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 4,
        textAlign: 'center',
        minHeight: '200px',
        backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.02)',
        borderRadius: 2,
        border: `1px dashed ${isDarkMode ? 'rgba(255, 255, 255, 0.2)' : 'rgba(0, 0, 0, 0.2)'}`,
      }}
    >
      <Typography
        variant="h4"
        component="div"
        sx={{
          fontSize: '3rem',
          marginBottom: 2,
          opacity: 0.7,
        }}
      >
        {content.icon}
      </Typography>
      
      <Typography
        variant="h6"
        component="h2"
        sx={{
          marginBottom: 1,
          color: isDarkMode ? 'text.primary' : 'text.primary',
          fontWeight: 'bold',
        }}
      >
        {content.title}
      </Typography>
      
      <Typography
        variant="body1"
        sx={{
          color: isDarkMode ? 'text.secondary' : 'text.secondary',
          maxWidth: '400px',
          lineHeight: 1.6,
        }}
      >
        {content.message}
      </Typography>
      
      <Alert
        severity="info"
        sx={{
          marginTop: 2,
          maxWidth: '400px',
          backgroundColor: isDarkMode ? 'rgba(25, 118, 210, 0.1)' : 'rgba(25, 118, 210, 0.05)',
          border: `1px solid ${isDarkMode ? 'rgba(25, 118, 210, 0.3)' : 'rgba(25, 118, 210, 0.2)'}`,
        }}
      >
        {isEnglish 
          ? 'The application will continue to function normally. Data will be loaded when available.'
          : 'La aplicación continuará funcionando normalmente. Los datos se cargarán cuando estén disponibles.'
        }
      </Alert>
    </Box>
  );
}; 