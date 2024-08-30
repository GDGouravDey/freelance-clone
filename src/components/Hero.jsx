import React, { useEffect } from "react";
import {
  useMotionTemplate,
  useMotionValue,
  motion,
  animate,
} from "framer-motion";
import logo from "../assets/logo2.png";

const COLORS_TOP = ["#2ecc71", "#228b22", "#808000", "#98fb98"];

export default function Hero() {
  const color = useMotionValue(COLORS_TOP[0]);

  useEffect(() => {
    animate(color, COLORS_TOP, {
      ease: "easeInOut",
      duration: 10,
      repeat: Infinity,
      repeatType: "mirror",
    });
  }, []);

  const backgroundImage = useMotionTemplate`radial-gradient(125% 125% at 50% 0%, #020617 50%, ${color})`;
  const border = useMotionTemplate`1px solid ${color}`;
  const boxShadow = useMotionTemplate`0px 4px 24px ${color}`;

  return (
      <motion.section
      style={{
          backgroundImage,
        }}
        className="relative grid min-h-screen place-content-center overflow-x-hidden bg-gray-950 px-4 text-gray-200"
        >
            <div className="-mt-44 relative -ml-72">
            <img src={logo} className="h-20" alt="KnowIdea" />
        </div>
      <div className="relative z-10 flex flex-col items-center">
        
        <div className="-mt-36 mb-20">

        {/* <NavigationMenuDemo/> */}
        </div>

        <span className="mb-1.5 inline-block rounded-full bg-gray-600/50 px-3 py-1.5 text-sm">
          Beta Now Live!
        </span>
        <h1 className="max-w-4xl bg-gradient-to-br from-white to-gray-400 bg-clip-text text-center text-3xl font-medium leading-tight text-transparent sm:text-5xl sm:leading-tight md:text-7xl md:leading-tight">
        Don't have any IDEA? <br/> <span className="-ml-20 mt-4 mb-0 text-lime-400">KnowIdea</span> 

        </h1>
        <img src='/Logo/logo.gif' className="w-80 -mt-56 ml-80"
        />
        <p className="my-6 max-w-xl text-center -mt-20 text-base leading-relaxed md:text-lg md:leading-relaxed">
        Solo and Sufficient? Or Ready to Conquer the World Together?
        </p>
        <motion.a
        href='/choose'
          style={{
            border,
            boxShadow,
          }}
          whileHover={{
            scale: 1.015,
          }}
          whileTap={{
            scale: 0.985,
          }}
          className="group relative flex w-fit items-center gap-1.5 rounded-full bg-gray-950/10 px-4 py-2 text-gray-50 transition-colors hover:bg-gray-950/50"
        >
          Start Now
        </motion.a>
      </div>

      <div className="absolute inset-0 z-0">
      </div>
    </motion.section>
  );
};