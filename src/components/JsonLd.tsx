/**
 * Renders a <script type="application/ld+json"> tag for structured data.
 * Accepts any JSON-LD object (or array of objects).
 */
export default function JsonLd({ data }: { data: Record<string, unknown> | Record<string, unknown>[] }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
