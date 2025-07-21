interface HtmlDetailContentProps {
  htmlString: string;
  className?: string;
}

export default function HtmlDetailContent({ htmlString, className }: HtmlDetailContentProps) {
  return (
    <div className={className}
      dangerouslySetInnerHTML={{ __html: htmlString }
      }
    />
  );
};