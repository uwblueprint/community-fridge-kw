import React from "react";

import MainPageButton from "../common/MainPageButton";

const CreatePage = (): React.ReactElement => {
  return (
    <div style={{ textAlign: "center", width: "25%", margin: "0px auto" }}>
      <h1>Default Page</h1>
      <MainPageButton />
    </div>
  );
};

export default CreatePage;
