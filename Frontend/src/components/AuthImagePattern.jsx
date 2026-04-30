import React from "react";

const AuthImagePattern = () => {
    const rotateOne = {
        animation: "rotateOne 1s linear infinite",
        transform: "rotateX(35deg) rotateY(-45deg)",
        borderBottom: "8px solid #f13a8f",
    };

    const rotateTwo = {
        animation: "rotateTwo 1s linear infinite",
        transform: "rotateX(50deg) rotateY(10deg)",
        borderRight: "8px solid #4bc8eb",
    };

    const rotateThree = {
        animation: "rotateThree 1s linear infinite",
        transform: "rotateX(35deg) rotateY(55deg)",
        borderTop: "8px solid #36f372",
    };

    return (
        <div className="h-screen w-full flex flex-col items-center justify-center text-white">
            {/* Loader */}
            <div className="relative w-80 h-80 rounded-full" style={{ perspective: "800px" }}>
                <div className="absolute w-full h-full rounded-full" style={rotateOne} />
                <div className="absolute w-full h-full rounded-full" style={rotateTwo} />
                <div className="absolute w-full h-full rounded-full" style={rotateThree} />
            </div>

            {/* Description */}
            <p className="mt-8 text-center text-lg text-gray-100 max-w-sm px-6 leading-relaxed tracking-wide">
                <span className="block text-xl font-semibold text-white animate-fade-in">
                    Talk Tight, Day or Night,
                </span>
                <span className="block text-xl font-semibold text-white animate-fade-in delay-200">
                    Everything Just Feels Right.
                </span>
            </p>


            {/* Keyframes */}
            <style>{`
        @keyframes rotateOne {
          to {
            transform: rotateX(35deg) rotateY(-45deg) rotateZ(360deg);
          }
        }
        @keyframes rotateTwo {
          to {
            transform: rotateX(50deg) rotateY(10deg) rotateZ(360deg);
          }
        }
        @keyframes rotateThree {
          to {
            transform: rotateX(35deg) rotateY(55deg) rotateZ(360deg);
          }
        }
      `}</style>
        </div>
    );
};

export default AuthImagePattern;
