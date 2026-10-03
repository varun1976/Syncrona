import React from "react";

const AuthImagePattern = () => {
    const rotateOne = {
        animation: "rotateOne 3s linear infinite",
        transform: "rotateX(35deg) rotateY(-45deg)",
        borderBottom: "4px solid var(--accent-color)",
        boxShadow: "0 0 10px var(--accent-color)",
    };

    const rotateTwo = {
        animation: "rotateTwo 3s linear infinite",
        transform: "rotateX(50deg) rotateY(10deg)",
        borderRight: "4px solid var(--success-color)",
        boxShadow: "0 0 10px var(--success-color)",
    };

    const rotateThree = {
        animation: "rotateThree 3s linear infinite",
        transform: "rotateX(35deg) rotateY(55deg)",
        borderTop: "4px solid var(--text-muted)",
        boxShadow: "0 0 10px var(--text-muted)",
    };

    return (
        <div className="hidden lg:flex h-full w-full flex-col items-center justify-center p-10 text-[var(--text-primary)] select-none neu-bg">
            {/* Soft Neumorphic Ring Container */}
            <div className="size-64 sm:size-72 rounded-full neu-raised-lg flex items-center justify-center p-6 relative">
                <div className="relative w-full h-full rounded-full neu-inset p-4" style={{ perspective: "800px" }}>
                    <div className="absolute inset-0 rounded-full" style={rotateOne} />
                    <div className="absolute inset-0 rounded-full" style={rotateTwo} />
                    <div className="absolute inset-0 rounded-full" style={rotateThree} />
                </div>
            </div>

            {/* Subtitle Typography */}
            <div className="mt-8 text-center max-w-sm space-y-1.5">
                <h2 className="text-xl font-bold tracking-tight text-[var(--text-primary)]">
                    Talk Tight, Day or Night
                </h2>
                <p className="text-xs font-semibold text-[var(--text-secondary)]">
                    Everything Just Feels Right.
                </p>
            </div>

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
