import React, { useEffect } from 'react';
import { useDataPreloader } from '../../hooks/useDataPreloader';
import './DataPreloader.scss';
import { gsap } from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';
interface DataPreloaderProps {
  children: React.ReactNode;
}

export const DataPreloader: React.FC<DataPreloaderProps> = ({ children }) => {
  const { initialized } = useDataPreloader();
  useEffect(() => {
    gsap.registerPlugin(TextPlugin);
    const loadingText = document.querySelector('.loading-text');
    if (loadingText) {
      gsap.to(loadingText, {
        duration: 2,
        text: "a normal part of life",
        ease: "power1.inOut",
        repeat: -1,
        yoyo: true,
        delay: 1,
      });
    }
  }, []);

  // Mostrar loading mientras se precargan los datos
  if (!initialized) {
    return (
      <div className="loading">
        <span className="loading-text subtitle is-size-5 has-text-centered">
          Feeling anxious is...
        </span>
    
      </div>

    );
  }

  return <>{children}</>;
}; 