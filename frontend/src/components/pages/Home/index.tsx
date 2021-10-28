import { Button } from "@chakra-ui/react";
import React from "react";

const Home = () => {
  return (
    <div>
      <h1>Welcome to Community Fridge KW</h1>
      <desc>
        Community fridges are public repositories of fresh, donated foods that
        anyone can take from for free.
      </desc>
      <Button size="lg">Schedule a food dropoff</Button>
      <Button size="lg">Sign up to volunteer</Button>
    </div>
  );
};

export default Home;
