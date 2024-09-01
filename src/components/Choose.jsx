import React, { useState } from "react";
import employerGif from "../assets/employer.gif";
import employeeGif from "../assets/employee.gif";
import stillEmployer from "../assets/stillemployer.png";
import stillEmployee from "../assets/stillemployee.png";

const path = [
    {
        name: "Employer",
        desc: "Find top freelancers to bring your projects to life and grow your business.",
        link: employerGif,
        still: stillEmployer,
        direct: "/sign-in?role=employer",
    },
    {
        name: "Freelancer",
        desc: "Showcase your skills and connect with employers for freelance opportunities.",
        link: employeeGif,
        still: stillEmployee,
        direct: "/sign-in?role=freelancer",
    },
];


function Choose() {

    return (
        <div className="bg-zinc-900 min-h-screen pt-6 sm:pt-4 lg:pt-4">
            <div className="mx-auto max-w-screen-2xl px-4 md:px-8">
                <div className="mb-2 md:mb-2">
                    <h2 className="mb-4 mt-2 text-center text-2xl font-bold text-white md:mb-2 lg:text-3xl">
                        Are You Here to <span className="text-[#8c52ff]">Hire</span> or{" "}
                        <span className="text-[#ff66c4]">Get Hired</span> ?
                    </h2>

                    <p className="mx-auto max-w-screen-md text-center text-neutral-400 md:text-lg">
                        Whether you're looking to find top talent for your project or seeking freelance opportunities, let's connect and make it happen.
                    </p>
                </div>


                <div className="flex px-16 gap-24 py-16">
                    {path.map((item, index) => (
                        <ImageCard
                            key={index}
                            item={item}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
};

const ImageCard = ({ item }) => {
    const [src, setSrc] = useState(item.still);

    return (
        <a
            href={item.direct}
            className="group relative block bg-black"
            onMouseEnter={() => setSrc(item.link)}
            onMouseLeave={() => setSrc(item.still)}
        >
            <img
                alt={item.name}
                src={src}
                className="absolute inset-0 h-[110%] w-full object-cover opacity-70 transition-opacity group-hover:opacity-50"
            />

            <div className="relative p-4 sm:p-6 lg:p-8">
                <p className="text-md font-medium uppercase tracking-widest text-white">
                    Join as
                </p>

                <p className="text-xl font-bold text-lime-400 drop-shadow-lg sm:text-3xl">
                    {item.name}
                </p>

                <div className="mt-32 sm:mt-48 lg:mt-64">
                    <div className="translate-y-20 transform opacity-0 transition-all group-hover:translate-y-5 group-hover:opacity-100">
                        <p className="text-sm text-white md:text-2xl">{item.desc}</p>
                    </div>
                </div>
            </div>
        </a>
    );
};

export default Choose;

