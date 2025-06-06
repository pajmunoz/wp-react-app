import { useColorScheme } from "@mui/material";

interface HtmlContentProps {
  htmlString: string;
  className?: string;
  themeMode?: boolean;
}

export default function HtmlContent({ htmlString, className }: HtmlContentProps) {
  const mode = useColorScheme();
  const isDarkMode = mode.mode === 'dark';
  return (
    <span className={`${className} ${isDarkMode ? 'has-text-white' : 'has-text-black'}`}
      dangerouslySetInnerHTML={{ __html: htmlString }
      }
    />
  );
};