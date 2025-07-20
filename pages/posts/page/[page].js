import { GetStaticPaths, GetStaticProps } from "next";
import Head from "next/head";
import Layout from "../../../components/Layout";
import BasicMeta from "../../../components/meta/BasicMeta";
import OpenGraphMeta from "../../../components/meta/OpenGraphMeta";
import TwitterCardMeta from "../../../components/meta/TwitterCardMeta";
import PostList from "../../../components/PostList";
import config from "../../../lib/config";
import { listTags } from "../../../lib/tags";

export default function Page({ posts, tags, pagination, page }) {
  const url = `/posts/page/${page}`;
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

export const getStaticProps = async ({ params }) => {
  const postsModule = require("../../../lib/posts");
  const mod = postsModule.default ? postsModule.default : postsModule;
  const page = parseInt(params.page);
  // Ensure all post dates are strings for serialization
  const posts = mod.listPostContent(page, config.posts_per_page).map((post) => ({
    ...post,
    date:
      typeof post.date === "string"
        ? post.date
        : post.date?.toISOString?.() || String(post.date),
  }));
  const tags = require("../../../lib/tags").listTags();
  const pagination = {
    current: page,
    pages: Math.ceil(mod.countPosts() / config.posts_per_page),
  };
  return {
    props: {
      page,
      posts,
      tags,
      pagination,
    },
  };
};

export const getStaticPaths = async () => {
  const { countPosts } = require("../../../lib/posts");
  const pages = Math.ceil(countPosts() / config.posts_per_page);
  const paths = Array.from(Array(pages - 1).keys()).map((it) => ({
    params: { page: (it + 2).toString() },
  }));
  return {
    paths: paths,
    fallback: false,
  };
};
