interface HtmlContentProps {
  htmlString: string;
  className?: string;
}

export default function HtmlContent({ htmlString, className }: HtmlContentProps) {
  return (
    <span className={className}
      dangerouslySetInnerHTML={{ __html: htmlString }
      }
    />
  );
};