import { useQuery } from "@apollo/react-hooks";
import { useRouter } from "next/router";
import Link from "next/link";
import gql from "graphql-tag";
import {
  ErrorPage,
  ForumPost,
  ForumSubcategory,
  LoadingPage,
  PostEditor,
  User
} from "../../components";
import { useState } from "react";

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
      numLikes
    }
  `
};

const GET_CATEGORY_POSTS = gql`
  query getPostsByCategory(
    $postsFromSlug: String!
    $page: Int!
    $limit: Int!
    $forumCategory: String!
  ) {
    categoryBySlug(slug: $postsFromSlug) {
      ...ForumPageCategory
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
    category(slug: $forumCategory) {
      ...ForumPageCategory
      children {
        ...ForumPageCategory
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
  <div className="w-2/12 hidden lg:block ml-12 mt-24 flex flex-col items-center">
    {children}
  </div>
);

const MainSection = ({ children }) => (
  <div className="w-full lg:w-9/12 flex flex-col lg:items-center mt-4">
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

const ForumCategoryTitle = ({
  name,
  forumCategory,
  subcategory,
  subCategoryName
}) => (
  <div className="flex text-gray-800 text-lg font-bold uppercase tracking-wider items-baseline">
    <Link href="/forum/[slug]" as={`/forum/${forumCategory}`}>
      <p className="mr-2 cursor-pointer hover:text-yume-red-darker">{name}</p>
    </Link>
    {subcategory && <i className="fas fa-chevron-right mr-2"></i>}
    {subcategory && <p className="text-yume-red ">{subCategoryName}</p>}
  </div>
);

const AskButton = props => (
  <button
    className="w-11/12 bg-gray-200 hover:bg-gray-300  rounded px-6 py-2 mb-6 cursor-pointer outline-none focus:outline-none"
    onMouseDown={props.onMouseDown}
  >
    {props.children}
  </button>
);

const ButtonsContainer = ({ children }) => (
  <div className="mx-10 mb-1 flex justify-end self-end">{children}</div>
);

const PostContainer = ({ children }) => (
  <div className="max-w-4xl mb-6 p-2 lg:w-11/12">{children}</div>
);

const BottomContainer = ({ children }) => (
  <div className="w-full flex justify-end pl-12 mb-8">{children}</div>
);

function ForumPosts() {
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const router = useRouter();

  // forumCategory: slug of one of the 4 big forum categories
  // subcategory: slug of the subcategory
  const { slug: forumCategory, page: page_str, subcategory } = router.query;
  const page = parseInt(page_str || 1);

  // If we get a subcategory query, then get posts for just that subcategory
  // else request all the posts for that forumCategory
  const postsFromSlug = subcategory || forumCategory;

  const { loading, error, data } = useQuery(GET_CATEGORY_POSTS, {
    variables: { postsFromSlug, page, limit: 10, forumCategory }
  });

  if (loading) {
    return <LoadingPage />;
  }
  if (error) {
    return <ErrorPage />;
  }

  const { categoryBySlug: postsData, category: forumCategoryData } = data;
  const { name, children: subcategories } = forumCategoryData;
  const {
    posts: post_resp,
    name: subCategoryName,
    id: subCategoryId
  } = postsData;
  const { nodes: posts, pages } = post_resp;

  return (
    <div className="container mx-auto">
      <StyledContainer>
        <SubcategorySection>
          <ForumSubcategory
            title={name}
            list={subcategories}
            selected={postsFromSlug}
            slug={forumCategory}
          />
        </SubcategorySection>
        <MainSection>
          {!posts || posts.length === 0 ? (
            <EmptyPostContaienr>
              <p className="text-2xl">No posts to show</p>
              <Link href="/forum" replace>
                <p className="cursor-pointer text-yume-red underline">
                  Go back to Forum
                </p>
              </Link>
            </EmptyPostContaienr>
          ) : (
            <>
              <TitleContainer>
                <User>
                  {({ data, error }) => {
                    const me = data ? data.whoami : null;

                    if (!me)
                      return (
                        <AskButton>
                          <Link href="/login">
                            <p className="font-semibold text-md text-gray-700">
                              Login to ask a question
                            </p>
                          </Link>
                        </AskButton>
                      );
                    return (
                      <>
                        <AskButton onMouseDown={() => setIsEditorOpen(true)}>
                          <p className="font-semibold text-md text-gray-700">
                            Ask a question
                          </p>
                        </AskButton>

                        <PostEditor
                          isEditorOpen={isEditorOpen}
                          setIsEditorOpen={setIsEditorOpen}
                          subcategories={subcategories}
                          selectedCategoryId={
                            // Important: Here if subcategory is not checked then passed will be forumCategory ID in which case
                            // the created post will never be shown
                            subcategory ? subCategoryId : null
                          }
                        />
                      </>
                    );
                  }}
                </User>
              </TitleContainer>
              <TitleContainer>
                <ForumCategoryTitle
                  name={name}
                  forumCategory={forumCategory}
                  subcategory={subcategory}
                  subCategoryName={subCategoryName}
                />
                <ButtonsContainer>
                  <LeftPageButton
                    router={router}
                    title="Previous"
                    page={page - 1}
                    forumCategory={forumCategory}
                    subcategory={subcategory}
                    isHidden={page === 1}
                  />
                  <RightPageButton
                    router={router}
                    title="Next"
                    page={page + 1}
                    forumCategory={forumCategory}
                    subcategory={subcategory}
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
              <BottomContainer>
                <ButtonsContainer>
                  <LeftPageButton
                    router={router}
                    title="Previous"
                    page={page - 1}
                    forumCategory={forumCategory}
                    subcategory={subcategory}
                    isHidden={page === 1}
                  />
                  <RightPageButton
                    router={router}
                    title="Next"
                    page={page + 1}
                    forumCategory={forumCategory}
                    subcategory={subcategory}
                    isHidden={page === pages}
                  />
                </ButtonsContainer>
              </BottomContainer>
            </>
          )}
        </MainSection>
      </StyledContainer>
    </div>
  );
}

const FuncPageButton = ({
  router,
  page,
  forumCategory,
  subcategory,
  children,
  isHidden
}) => (
  <button
    className={
      "w-24 fill-current hover:text-white hover:bg-yume-red rounded-lg flex items-center justify-around p-2 text-yume-red-darker mr-6 outline-none focus:outline-none" +
      (isHidden ? " hidden" : "")
    }
    onClick={() => {
      // Needs full query on "as" for displaying on url bar, "query" for query data
      // and pathname has to match the filename
      // Note: Throws errors if not provided all three params

      const pathname = "/forum/[slug]";
      const query = { page, subcategory };
      let asPath = `/forum/${forumCategory}`;
      if (subcategory) {
        asPath += `?subcategory=${subcategory}`;
      }
      asPath += (subcategory ? `&` : "?") + `page=${page}`;

      router.push({ pathname, query }, asPath);
    }}
  >
    {children}
  </button>
);

const LeftPageButton = props => (
  <FuncPageButton {...props}>
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
    {props.title}
  </FuncPageButton>
);

const RightPageButton = props => (
  <FuncPageButton {...props}>
    {props.title}
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
  </FuncPageButton>
);

export default ForumPosts;
export { GET_CATEGORY_POSTS };
