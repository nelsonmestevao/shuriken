import { BlogMenu } from "@blog";

import { getAllPosts, getAuthors, BlogProps } from "~/lib/blog";

interface Props {
  blogProps: BlogProps;
  author: {
    name: string;
    photo: string;
  };
}

const Blog = ({ blogProps, author }: Props) => {
  return (
    <BlogMenu
      posts={blogProps.posts}
      topics={blogProps.topics}
      authors={blogProps.authors}
      featured={blogProps.featured}
      author={author.name}
      topic={null}
    />
  );
};

export async function getStaticProps({ params }) {
  const postList = getAllPosts([
    "title",
    "slug",
    "date",
    "author",
    "topic",
    "featured",
    "description",
  ]).filter((entry) => entry.author["name"] == params.author);
  let topicsDup = postList.map((entry) => entry.topic);
  let topics = topicsDup.filter((element, index) => {
    return topicsDup.indexOf(element) === index;
  });

  return {
    props: {
      blogProps: {
        posts: postList,
        topics: topics,
        authors: getAuthors(postList),
        featured: postList.filter((entry) => entry.featured == "true"),
      },
      author: params.author,
    },
  };
}

export async function getStaticPaths() {
  const posts = getAllPosts(["author"]);
  return {
    paths: posts.map((post) => {
      return {
        params: {
          author: post.author["name"],
        },
      };
    }),
    fallback: false,
  };
}

export default Blog;
