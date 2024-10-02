import Post from "./Post";
import PostSkeleton from "../skeletons/PostSkeleton";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

const Posts = ({ feedType }) => {
  const getPostEndpoint = () => {
    switch (feedType) {
      case "forYou":
        return "/api/posts/all";
      case "following":
        return "/api/posts/following";
      default:
        return "/api/posts/all";
    }
  };

  const POST_ENDPOINT = getPostEndpoint();

  const {
    data: posts,
    isLoading,
    refetch,
    isRefetching,
    error,
  } = useQuery({
    queryKey: ["posts", feedType],
    queryFn: async () => {
      try {
        const res = await fetch(POST_ENDPOINT);
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong!");
        }

        return data;
      } catch (error) {
        console.error("Error fetching posts:", error);
        throw new Error(error.message);
      }
    },
  });

  useEffect(() => {
    refetch();
  }, [feedType, refetch]);

  // Check if posts is actually an array
  const isArrayOfPosts = Array.isArray(posts);

  return (
    <>
      {(isLoading || isRefetching) && (
        <div className="flex flex-col justify-center">
          <PostSkeleton />
          <PostSkeleton />
          <PostSkeleton />
        </div>
      )}
      {!isLoading && !isRefetching && posts?.length === 0 && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {!isLoading && !isRefetching && isArrayOfPosts && posts.length > 0 && (
        <div>
          {posts.map((post) => (
            <Post key={post._id} post={post} />
          ))}
        </div>
      )}
      {!isLoading && !isArrayOfPosts && (
        <p className="text-center my-4">No posts in this tab. Switch 👻</p>
      )}
      {error && (
        <p className="text-center my-4 text-red-500">{error.message}</p>
      )}
    </>
  );
};

export default Posts;
