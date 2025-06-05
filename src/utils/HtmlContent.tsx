interface HtmlContentProps {
  htmlString: string;
  className?: string;
  themeMode?: boolean;
}

export default function HtmlContent({ htmlString, className, themeMode }: HtmlContentProps) {
  return (
    <span className={`${className} ${themeMode ? 'has-text-white' : 'has-text-black'}`}
      dangerouslySetInnerHTML={{ __html: htmlString }
      }
    />
  );
};