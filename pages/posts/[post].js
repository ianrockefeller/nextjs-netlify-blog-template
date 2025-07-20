import { MDXRemote } from "next-mdx-remote";
import matter from "gray-matter";
import { parseISO } from 'date-fns';
import PostLayout from "../../components/PostLayout";
import YouTube from "react-youtube";
import { serialize } from "next-mdx-remote/serialize";
const components = { YouTube };

export default function Post({
  title,
  dateString,
  slug,
  tags,
  author,
  description = "",
  source,
}) {
  return (
    <PostLayout
      title={title}
      date={parseISO(dateString)}
      slug={slug}
      tags={tags}
      author={author}
      description={description}
    >
      <MDXRemote {...source} components={components} />
    </PostLayout>
  );
}

export const getStaticPaths = async () => {
  const postsModule = await import("../../lib/posts");
  const paths = postsModule.default
    ? postsModule.default.fetchPostContent().map(it => ({ params: { post: it.slug } }))
    : postsModule.fetchPostContent().map(it => ({ params: { post: it.slug } }));
  return {
    paths,
    fallback: false,
  };
};

export const getStaticProps = async ({ params }) => {
  const postsModule = await import("../../lib/posts");
  const fetchPostContent = postsModule.default
    ? postsModule.default.fetchPostContent
    : postsModule.fetchPostContent;
  const fs = require("fs");
  const slugToPostContent = (postContents => {
    let hash = {};
    postContents.forEach(it => hash[it.slug] = it);
    return hash;
  })(fetchPostContent());
  const slug = params.post;
  const source = fs.readFileSync(slugToPostContent[slug].fullPath, "utf8");
  const { content, data } = matter(source, {
    engines: { json: (s) => JSON.parse(s) }
  });
  // Ensure dateString is a string, not a Date object
  const dateString = typeof data.date === "string" ? data.date : data.date?.toISOString?.() || String(data.date);
  // Ensure scope.date is also a string for serialization
  const safeScope = { ...data, date: dateString };
  const mdxSource = await serialize(content, { scope: safeScope });
  return {
    props: {
      title: data.title,
      dateString,
      slug: data.slug,
      description: "",
      tags: data.tags,
      author: data.author,
      source: mdxSource
    },
  };
};

