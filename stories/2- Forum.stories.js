import React from "react";
import Banner from "../components/Banner";
import ForumCategory from "../components/ForumCategory";
import ForumPost from "../components/ForumPost";
import ForumSubcategory from "../components/ForumSubcategory";

export default {
  title: "Forum"
};

export const ForumCategories = () => (
  <ForumCategory name="Academics" number="280" />
);

export const Banners = () => (
  <Banner title="Admissions" subtitle="Welcome to the Admissions Category" />
);

const post = {
  caption: "How important is research for college apps?",
  comment:
    "Hi everyone, I'm currently a junior in high school. I got rejected from a few summer programs and I doubt professors are still accepting students to intern/volunteer in their labs. So I was wondering, how important is having research experience when applying for college? Do I still have a chance of getting into top schools without it?"
};

export const ForumPosts = () => <ForumPost {...post} />;

const admissions = {
  title: "Admissions",
  list: [{ name: "College Essays" }, { name: "Test Prep" }]
};
export const SubCategories = () => <ForumSubcategory {...admissions} />;
