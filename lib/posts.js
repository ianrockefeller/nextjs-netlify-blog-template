// WARNING: Do not import this module in React components or client-side code.
// Only use in getStaticProps/getStaticPaths/getServerSideProps.

import matter from "gray-matter";
import path from "path";

const postsDirectory = path.join(process.cwd(), "content/posts");

let postCache;

export function fetchPostContent() {
  if (typeof window !== "undefined") {
    throw new Error("fetchPostContent can only be used server-side.");
  }
  const fs = require("fs");
  if (postCache) {
    return postCache;
  }
  // Get file names under /posts
  const fileNames = fs.readdirSync(postsDirectory);
  const allPostsData = fileNames
    .filter((it) => it.endsWith(".mdx"))
    .map((fileName) => {
      // Read markdown file as string
      const fullPath = path.join(postsDirectory, fileName);
      const fileContents = fs.readFileSync(fullPath, "utf8");

      // Use gray-matter to parse the post metadata section
      const matterResult = matter(fileContents, {
        engines: {
          json: (s) => JSON.parse(s),
        },
      });
      const matterData = matterResult.data;
      matterData.fullPath = fullPath;

      const slug = fileName.replace(/\.mdx$/, "");

      // Validate slug string
      if (matterData.slug !== slug) {
        throw new Error(
          "slug field not match with the path of its content source"
        );
      }

      return matterData;
    });
  // Sort posts by date
  postCache = allPostsData.sort((a, b) => {
    if (a.date < b.date) {
      return 1;
    } else {
      return -1;
    }
  });
  return postCache;
}

export function countPosts(tag) {
  return fetchPostContent().filter(
    (it) => !tag || (it.tags && it.tags.includes(tag))
  ).length;
}

export function listPostContent(
  page,
  limit,
  tag
) {
  return fetchPostContent()
    .filter((it) => !tag || (it.tags && it.tags.includes(tag)))
    .slice((page - 1) * limit, page * limit);
}

// Export all functions as named exports and as a default object for compatibility with dynamic import
export default {
  fetchPostContent,
  countPosts,
  listPostContent,
};
