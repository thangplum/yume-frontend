import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { Post, ErrorPage, LoadingPage, Reply, User } from "../../components";
import Comment from "../../components/Comment";
import Link from "next/link";
import ReplyEditor from "../../components/ReplyEditor";
import CommentEditor from "../../components/CommentEditor";
import { useState } from "react";

const fragments = {
  user: gql`
    fragment UserFragment on User {
      username
      firstName
      lastName
    }
  `,
  post: gql`
    fragment PostFragment on Post {
      id
      slug
      caption
      comment
      created
      numLikes
      likes
    }
  `
};

const GET_POST_FROM_SLUG = gql`
  query GET_POST_FROM_SLUG($slug: String!) {
    postBySlug(slug: $slug) {
      ...PostFragment
      category {
        id
        name
        slug
      }
      author {
        ...UserFragment
      }
      replies {
        id
        comment
        likes
        numLikes
        comments {
          id
          comment
          likes
          numLikes
          author {
            ...UserFragment
          }
        }
        author {
          ...UserFragment
        }
      }
    }
  }
  ${fragments.user}
  ${fragments.post}
`;

const Thread = () => {
  const router = useRouter();
  const { slug } = router.query;

  const { loading, error, data } = useQuery(GET_POST_FROM_SLUG, {
    variables: { slug }
  });

  if (loading) {
    return <LoadingPage />;
  }
  if (error) return <ErrorPage />;

  const {
    id: postId,
    caption,
    comment,
    created,
    replies,
    likes,
    numLikes,
    category,
    author
  } = data.postBySlug;

  const MainSection = ({ children }) => (
    <div className="max-w-5xl p-8 flex flex-col items-start">{children}</div>
  );

  const PostContainer = ({ children }) => (
    <div className="bg-gray-200 flex items-center justify-center mb-10">
      {children}
    </div>
  );

  const ThreadSection = ({ children }) => (
    <div className="flex flex-col w-full mb-4">{children}</div>
  );

  const CommentSection = props => {
    const [visible, setVisible] = useState(false);
    if (!props.size) {
      return (
        <div className="w-full flex flex-col mt-2 items-start justify-end animated pulse faster">
          {props.children}
        </div>
      );
    }
    if (!visible && props.size)
      return (
        <>
          <button
            className="max-w-md bg-gray-200 hover:bg-gray-300  rounded px-6 py-2 ml-1 mt-1 mb-6 cursor-pointer outline-none focus:outline-none text-sm tracking-wide font-medium text-gray-600"
            onClick={() => setVisible(true)}
          >
            Show the comments
          </button>
        </>
      );
    return (
      <>
        <button
          className="max-w-md bg-gray-200 hover:bg-gray-300  rounded px-6 py-2 ml-1 mt-1 mb-2 cursor-pointer outline-none focus:outline-none text-sm tracking-wide font-medium text-gray-600"
          onClick={() => setVisible(false)}
        >
          Hide the comments
        </button>
        <div className="w-full flex flex-col mt-2 items-start justify-end animated pulse faster">
          {props.children}
        </div>
      </>
    );
  };
  return (
    <div className="container mx-auto">
      <MainSection>
        <div className="mb-8 pl-2 antialiased">
          <Link href="/forum/[slug]" as={"/forum/" + category.slug}>
            <a className="text-yume-red-darker font-bold text-lg tracking-wider cursor-pointer uppercase">
              {category.name}
            </a>
          </Link>
        </div>
        <PostContainer>
          <Post
            id={postId}
            caption={caption}
            comment={comment}
            likes={likes}
            numLikes={numLikes}
            numReplies={replies.length}
            author={author}
            slug={slug}
          />
        </PostContainer>
        <div className="mb-8 pl-2 antialiased">
          <p className="font-bold text-lg tracking-wider">REPLIES</p>
        </div>
        <>
          <User>
            {({ data }) => {
              const me = data ? data.whoami : null;
              if (!me) {
                return (
                  <button className="w-full bg-gray-200 hover:bg-gray-300  rounded px-6 py-2 mb-6 cursor-pointer outline-none focus:outline-none">
                    <Link href="/login">
                      <p className="font-semibold text-md text-gray-700">
                        Login to reply to question
                      </p>
                    </Link>
                  </button>
                );
              }
              return (
                <div className="reply-editor px-4 pt-6 bg-white max-w-3xl w-11/12 mb-8 border rounded-lg flex flex-col">
                  <ReplyEditor postId={postId} postSlug={slug} />
                </div>
              );
            }}
          </User>

          {replies.map((reply, replyIndex) => (
            <ThreadSection key={reply.id}>
              <Reply {...reply} postSlug={slug} />
              <CommentSection size={reply.comments.length}>
                {reply.comments.map(comment => (
                  <div key={comment.id} className="max-w-2xl">
                    <Comment {...comment} postSlug={slug} />
                  </div>
                ))}
                <div className="w-6/12 mb-4">
                  <User>
                    {({ data, error }) => {
                      const me = data ? data.whoami : null;
                      if (!me && replyIndex === 0) {
                        return (
                          <button className="w-full bg-gray-200 hover:bg-gray-300  rounded px-6 py-1 mb-6 cursor-pointer outline-none focus:outline-none">
                            <Link href="/login">
                              <p className="font-semibold text-xs text-gray-700">
                                Login to leave a comment
                              </p>
                            </Link>
                          </button>
                        );
                      }
                      if (!me) return null;
                      return (
                        <CommentEditor replyId={reply.id} postSlug={slug} />
                      );
                    }}
                  </User>
                </div>
              </CommentSection>
            </ThreadSection>
          ))}
        </>
      </MainSection>
    </div>
  );
};

export default Thread;
export { GET_POST_FROM_SLUG };
