import Link from "next/link";

export default function Tag({ tag }) {
  return (
    <Link href={`/posts/tags/${tag.slug}`}>
      {"#" + tag.name}
    </Link>
  );
}
