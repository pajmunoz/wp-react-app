interface HtmlContentProps {
  htmlString: string;
  className?: string;
}

export default function HtmlContent({ htmlString, className }: HtmlContentProps) {
  return (
    <section className={className}
      dangerouslySetInnerHTML={{ __html: htmlString }
      }
    />
  );
};