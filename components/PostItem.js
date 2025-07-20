import Date from "./Date";
import Link from "next/link";
import { parseISO } from "date-fns";

export default function PostItem({ post }) {
  return (
    <Link href={"/posts/" + post.slug}>
      <>
        <Date date={parseISO(post.date)} />
        <h2>{post.title}</h2>
        <style jsx>
          {`
            :global(a) {
              color: #222;
              display: inline-block;
            }
            h2 {
              margin: 0;
              font-weight: 500;
            }
          `}
        </style>
      </>
    </Link>
  );
}
