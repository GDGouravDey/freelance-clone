import ButtonGradient from "./assets/svg/ButtonGradient";
import Benefits from "./components/Benefits";
import Footer from "./components/Footer";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Roadmap from "./components/Roadmap";


const App = () => {
  return (
    <>
      <div className="pt-[4.75rem] lg:pt-[3.9rem] overflow-hidden">
        <Header />
        <Hero />
        <Benefits />
        <Roadmap />
        <Footer />
      </div>

      <ButtonGradient />
    </>
  );
};

export default App;
