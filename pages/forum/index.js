import { useQuery, useApolloClient } from "@apollo/react-hooks";
import gql from "graphql-tag";
import {
  Banner,
  ErrorPage,
  ForumCategory,
  LoadingPage
} from "../../components";
import CategoryAdmissionsIcon from "../../icons/undraw_teacher.svg";
import CategoryAcademicsIcon from "../../icons/undraw_studying.svg";
import CategoryCollegeLifeIcon from "../../icons/undraw_having_fun.svg";
import CategoryCareersIcon from "../../icons/undraw_career_progress.svg";

const categoryIconForSlug = {
  Admissions: CategoryAdmissionsIcon,
  Academics: CategoryAcademicsIcon,
  "College-Life": CategoryCollegeLifeIcon,
  Careers: CategoryCareersIcon
};

const categoryTextForSlug = {
  Admissions:
    "Join the admissions community to discuss college admissions, finding the right university and writing that essay",
  Academics:
    "Look at the academics community to talk majors, research, college academic success, and getting help with homework",
  "College-Life":
    "Join the college life community for college survival tips, and how to make the most of college life",
  Careers:
    "The careers community is the step towards exploring life after college, getting a job and everything else"
};

const GET_FORUM_CATEGORIES_QUERY = gql`
  query getForumCategories {
    forumCategories {
      id
      name
      slug
      children {
        id
        name
        slug
      }
    }
  }
`;
function Forum() {
  const { loading, error, data } = useQuery(GET_FORUM_CATEGORIES_QUERY);

  if (loading) return <LoadingPage />;
  if (error) return <ErrorPage />;

  const { forumCategories } = data;
  return (
    <div className="container mx-auto">
      <Banner title="Welcome to the Best College Forum." />
      <div className="w-full flex flex-wrap justify-center ">
        <div className="flex flex-col mt-2 pb-12">
          <p className="text-yume-red text-2xl tracking-widest font-semibold uppercase my-4">
            categories
          </p>
          {forumCategories.map(cat => {
            return (
              <div className="mb-6" key={cat.id}>
                <ForumCategory
                  categoryIconForSlug={categoryIconForSlug}
                  categoryTextForSlug={categoryTextForSlug}
                  name={cat.name}
                  number={cat.children.length}
                  id={cat.id}
                  slug={cat.slug}
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default Forum;
