import React from "react";
import Post from "../components/Post";
import Reply from "../components/Reply";

export default {
  title: "Feed"
};

const post = {
  caption: "How important is research for college apps?",
  comment:
    "Hi everyone, I'm currently a junior in high school. I got rejected from a few summer programs and I doubt professors are still accepting students to intern/volunteer in their labs. So I was wondering, how important is having research experience when applying for college? Do I still have a chance of getting into top schools without it?"
};

export const Posts = () => <Post {...post} />;

export const Replies = () => <Reply />;
