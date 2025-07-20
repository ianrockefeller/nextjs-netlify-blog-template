import Link from "next/link";

export default function TagButton({ tag }) {
  return (
    <>
      <Link href={`/posts/tags/${tag.slug}`}>{tag.name}</Link>
      <style jsx>{`
        :global(a),
        :global(a:active),
        :global(a:hover),
        :global(a.active) {
          display: inline-block;
          border-radius: 3px;
          background-color: rgba(21, 132, 125, 0.2);
          color: #15847d;
          transition: background-color 0.3s ease;
          padding: 0.25em 0.5em;
        }
        :global(a:active),
        :global(a:hover) {
          background-color: rgba(21, 132, 125, 0.4);
        }
      `}</style>
    </>
  );
}
