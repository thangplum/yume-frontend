import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import { Post, ErrorPage, LoadingPage, Reply } from "../../components";
import Comment from "../../components/Comment";
import Link from "next/link";

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
      likes
    }
  `
};

const GET_POST = gql`
  query Post($slug: String!) {
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
        comments {
          id
          comment
          likes
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

  const { loading, error, data } = useQuery(GET_POST, {
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
    <div className="flex flex-col">{children}</div>
  );

  const CommentSection = ({ children }) => (
    <div className="w-full flex flex-col mt-2 items-end justify-end">
      {children}
    </div>
  );
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
            caption={caption}
            comment={comment}
            likes={likes}
            numReplies={replies.length}
            author={author}
          />
        </PostContainer>
        <div className="mb-8 pl-2 antialiased">
          <p className="font-bold text-lg tracking-wider">REPLIES</p>
        </div>
        <>
          {replies.map(reply => (
            <ThreadSection key={reply.id}>
              <Reply {...reply} />
              <CommentSection>
                {reply.comments.map(comment => (
                  <div key={comment.id} className="max-w-2xl">
                    <Comment {...comment} />
                  </div>
                ))}
              </CommentSection>
            </ThreadSection>
          ))}
        </>
      </MainSection>
    </div>
  );
};

export default Thread;
