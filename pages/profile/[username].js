import React from "react";
import dynamic from "next/dynamic";

const DynamicProfilePage = dynamic(() =>
  import("../../components/ProfilePage")
);

function Profile() {
  return <DynamicProfilePage />;
}

export default Profile;
