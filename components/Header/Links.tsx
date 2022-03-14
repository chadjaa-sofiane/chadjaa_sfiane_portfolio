import { Tabs, Tab } from "@components/core/Tabs";

const Link = () => {
  return (
    <div>
      <Tabs defaultValue="fff">
        <Tab name="fff"> Home </Tab>
        <Tab name="sss"> About </Tab>
        <Tab name="ggg"> Contact </Tab>
      </Tabs>
    </div>
  );
};

export default Link;
