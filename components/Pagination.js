import { generatePagination } from "../lib/pagination";
import Link from "next/link";

export default function Pagination({ current, pages, link }) {
  const pagination = generatePagination(current, pages);
  return (
    <ul>
      {pagination.map((it, i) => (
        <li key={i}>
          {it.excerpt ? (
            "..."
          ) : (
            <Link href={link.href(it.page)} className={it.page === current ? "active" : undefined}>
              {it.page}
            </Link>
          )}
        </li>
      ))}
      <style jsx>{`
        ul {
          list-style: none;
          margin: 3rem 0 0 0;
          padding: 0;
        }
        li {
          display: inline-block;
          margin-right: 1em;
          color: #9b9b9b;
          font-size: 1.25rem;
        }
        :global(.active) {
          color: #222;
          font-weight: bold;
        }
      `}</style>
    </ul>
  );
}
