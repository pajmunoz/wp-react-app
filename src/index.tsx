import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.scss';
import reportWebVitals from './reportWebVitals';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './pages/Home/Home';
import Layout from './components/Layout/Layout';
import About from './pages/About/About';
import Detail from './pages/Detail/Detail';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LanguageProvider } from './context/LanguageContext';
import { purple,lime } from '@mui/material/colors';

const queryClient = new QueryClient();
const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

const theme = createTheme({
  colorSchemes: {
    dark: true,
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#161616',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

root.render(
  <LanguageProvider>
  <QueryClientProvider client={queryClient}>
    <React.StrictMode>
      <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter basename="/">
        <Routes>
          <Route path='/' element={<Layout />}>
            <Route index element={<Home />} />
            <Route path='home' element={<Home />} />
            <Route path='/:slug' element={<Detail />} />
            <Route path='about' element={<About />} />
          </Route>
        </Routes>
      </BrowserRouter>
      </ThemeProvider>
    </React.StrictMode>
  </QueryClientProvider>
  </LanguageProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
