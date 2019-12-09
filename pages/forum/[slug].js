import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import gql from "graphql-tag";

import {
  ErrorPage,
  ForumPost,
  ForumSubcategory,
  LoadingPage
} from "../../components";

const fragments = {
  category: gql`
    fragment ForumPageCategory on Category {
      id
      name
      slug
    }
  `,
  post: gql`
    fragment ForumPagePost on Post {
      id
      slug
      caption
      comment
      created
      likes
    }
  `
};

const GET_CATEGORY_POSTS = gql`
  query getPostsByCategory($slug: String!, $page: Int!, $limit: Int!) {
    categoryBySlug(slug: $slug) {
      ...ForumPageCategory
      children {
        ...ForumPageCategory
      }
      posts(page: $page, limit: $limit) {
        nodes {
          ...ForumPagePost
          replies(limit: 5) {
            id
            comment
          }
        }
        pages
      }
    }
  }
  ${fragments.category}
  ${fragments.post}
`;

const StyledContainer = ({ children }) => (
  <div className="flex flex-col lg:flex-row">{children}</div>
);

const SubcategorySection = ({ children }) => (
  <div className="w-3/12 hidden lg:block ml-12 mt-12 flex flex-col items-center">
    {children}
  </div>
);

const MainSection = ({ children }) => (
  <div className="w-full lg:w-9/12 flex flex-col lg:items-center mt-6">
    {children}
  </div>
);

const EmptyPostContaienr = ({ children }) => (
  <div className="w-full h-full flex flex-col items-center justify-around">
    {children}
  </div>
);

const TitleContainer = ({ children }) => (
  <div className="w-full flex justify-between pl-12">{children}</div>
);

const ButtonsContainer = ({ children }) => (
  <div className="mx-10 mb-4 flex justify-end self-end">{children}</div>
);

const PostContainer = ({ children }) => (
  <div className="max-w-4xl mb-6 p-2 lg:w-11/12">{children}</div>
);

function ForumPosts() {
  const router = useRouter();
  const { slug, page: page_str } = router.query;
  const page = parseInt(page_str || 1);

  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    variables: { slug, page, limit: 10 }
  });

  if (loading) {
    return <LoadingPage />;
  }
  if (error) {
    return <ErrorPage />;
  }

  const { categoryBySlug: category } = data;
  const { name, children: subcategories, posts: post_resp } = category;
  const { nodes: posts, pages } = post_resp;

  return (
    <div className="container mx-auto">
      <StyledContainer>
        <SubcategorySection>
          <ForumSubcategory title={name} list={subcategories} />
        </SubcategorySection>
        <MainSection>
          {!posts || posts.length === 0 ? (
            <EmptyPostContaienr>
              <p className="text-2xl">No posts to show</p>
              <Link href="/forum" replace>
                <p class="cursor-pointer text-yume-red underline">
                  Go back to Forum
                </p>
              </Link>
            </EmptyPostContaienr>
          ) : (
            <>
              <TitleContainer>
                <p className="text-yume-red-darker text-2xl font-bold uppercase tracking-wider">
                  {name}
                </p>
                <ButtonsContainer>
                  <LeftPageButton
                    router={router}
                    title="Previous"
                    routeParams={{
                      pathname: `/forum/${slug}`,
                      query: { page: page - 1 }
                    }}
                    isHidden={page === 1}
                  />
                  <RightPageButton
                    router={router}
                    title="Next"
                    routeParams={{
                      pathname: `/forum/${slug}`,
                      query: { page: page + 1 }
                    }}
                    isHidden={page === pages}
                  />
                </ButtonsContainer>
              </TitleContainer>
              <>
                {posts.map(post => (
                  <PostContainer key={post.id}>
                    <ForumPost {...post} />
                  </PostContainer>
                ))}
              </>
            </>
          )}
        </MainSection>
      </StyledContainer>
    </div>
  );
}

const LeftPageButton = ({ router, routeParams, title, isHidden }) => (
  <button
    className={
      "w-24 fill-current hover:text-white hover:bg-yume-red rounded-lg flex items-center justify-around p-2 text-yume-red-darker mr-6" +
      (isHidden ? " hidden" : "")
    }
    onClick={() => {
      router.push(routeParams);
    }}
  >
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 20 20"
      enableBackground="new 0 0 20 20"
      className=" w-4 h-4 flex items-center justify-center"
    >
      <path
        d="M12.452,4.516c0.446,0.436,0.481,1.043,0,1.576L8.705,10l3.747,3.908c0.481,0.533,0.446,1.141,0,1.574
	c-0.445,0.436-1.197,0.408-1.615,0c-0.418-0.406-4.502-4.695-4.502-4.695C6.112,10.57,6,10.285,6,10s0.112-0.57,0.335-0.789
	c0,0,4.084-4.287,4.502-4.695C11.255,4.107,12.007,4.08,12.452,4.516z"
      />
    </svg>
    {title}
  </button>
);

const RightPageButton = ({ router, routeParams, title, isHidden }) => (
  <button
    className={
      "w-24 fill-current hover:text-white hover:bg-yume-red rounded-lg p-2  flex items-center justify-around text-yume-red-darker" +
      (isHidden ? " hidden" : "")
    }
    onClick={() => {
      router.push(routeParams);
    }}
  >
    {title}
    <svg
      x="0px"
      y="0px"
      viewBox="0 0 20 20"
      enableBackground="new 0 0 20 20"
      className=" w-4 h-4 flex items-center justify-center"
    >
      <path
        d="M9.163,4.516c0.418,0.408,4.502,4.695,4.502,4.695C13.888,9.43,14,9.715,14,10s-0.112,0.57-0.335,0.787
	c0,0-4.084,4.289-4.502,4.695c-0.418,0.408-1.17,0.436-1.615,0c-0.446-0.434-0.481-1.041,0-1.574L11.295,10L7.548,6.092
	c-0.481-0.533-0.446-1.141,0-1.576C7.993,4.08,8.745,4.107,9.163,4.516z"
      />
    </svg>
  </button>
);

export default ForumPosts;
