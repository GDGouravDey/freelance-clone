import ButtonGradient from "../assets/svg/ButtonGradient";
import Benefits from "./homepage/Benefits";
import Collaboration from "./homepage/Collaboration";
import Footer from "./homepage/Footer";
import Header from "./homepage/Header";
import Hero2 from "./homepage/Hero";
import Pricing from "./homepage/Pricing";
import Roadmap from "./homepage/Roadmap";
import Services from "./homepage/Services";
import { useNavigate } from "react-router-dom";

const Hero = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/choose');
  };
  return (
    <>
      {/* <div className="pt-[4.75rem] lg:pt-[5.25rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Collaboration />
        <Services />
        <Pricing />
        <Roadmap />
        <Footer />
      </div>

      <ButtonGradient /> */}
      <p>Work in Progress</p>
      <button className="bg-green-500 rounded-md p-2 m-2" onClick={handleClick}>
      Get Started
    </button>
    </>
  );
};

export default Hero;
