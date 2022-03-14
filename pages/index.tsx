import { Card } from "@components/Card";
import { Button } from "@components/core/Button";
import { Pagination } from "@components/core/Pagination";
import { Title1, Title2, Title3, Title4 } from "@components/core/Typography";
import type { NextPage } from "next";

const Home: NextPage = () => {
  return (
    <div>
      <Title1> Header one </Title1>
      <Title1>sofriane king the world</Title1>
      <Title2> Header two </Title2>
      <Title3> Header three </Title3>
      <Title4> Header four </Title4>

      <Button>Button</Button>
      <br />
      <br />
      <Pagination count={5} />
      <Pagination count={3} />
      <Card></Card>
    </div>
  );
};

export default Home;
