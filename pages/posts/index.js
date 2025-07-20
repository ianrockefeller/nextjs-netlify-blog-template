import Layout from "../../components/Layout";
import BasicMeta from "../../components/meta/BasicMeta";
import OpenGraphMeta from "../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../components/meta/TwitterCardMeta";
import PostList from "../../components/PostList";
import config from "../../lib/config";
import { listTags } from "../../lib/tags";
import Head from "next/head";

export default function Index({ posts, tags, pagination }) {
  const url = "/posts";
  const title = "All posts";
  return (
    <Layout>
      <BasicMeta url={url} title={title} />
      <OpenGraphMeta url={url} title={title} />
      <TwitterCardMeta url={url} title={title} />
      <PostList posts={posts} tags={tags} pagination={pagination} />
    </Layout>
  );
}

export const getStaticProps = async () => {
  const postsModule = require("../../lib/posts");
  let mod = postsModule.default ? postsModule.default : postsModule;
  let posts = mod.listPostContent(1, config.posts_per_page);

  // Ensure all post.date fields are strings for serialization
  posts = posts.map(post => ({
    ...post,
    date: typeof post.date === "string" ? post.date : post.date?.toISOString?.() || String(post.date),
  }));

  const tags = listTags();
  const pagination = {
    current: 1,
    pages: Math.ceil(mod.countPosts() / config.posts_per_page),
  };
  return {
    props: {
      posts,
      tags,
      pagination,
    },
  };
};
