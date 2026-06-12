import { useState } from "react";
import Layout from "./components/Layout";
import About from "./pages/About";
import CRM from "./pages/CRM";
import EDA from "./pages/EDA";
import Overview from "./pages/Overview";
import Prediction from "./pages/Prediction";

export default function App() {
  const [activePage, setActivePage] = useState("overview");

  const pages = {
    overview: <Overview />,
    eda: <EDA />,
    crm: <CRM />,
    prediction: <Prediction />,
    about: <About />,
  };

  return (
    <Layout activePage={activePage} setActivePage={setActivePage}>
      {pages[activePage]}
    </Layout>
  );
}