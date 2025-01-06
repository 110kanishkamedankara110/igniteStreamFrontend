"use client";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import Paralax from "@/components/Paralax";
import { useRouter } from "next/navigation";
import AnimatedCheckbox from "@/components/AnimatedCheckBox";

interface Layer {
  zIndex: number;
  image: string;
  size: string;
  bottom: number;
  left: number;
  width: string;
  height: string;
  float?: boolean;
  parralax?: boolean;
}

const layers2: Layer[] = [
  {
    zIndex: 10,
    image: "birds4.png",
    size: "contain",
    bottom: 100,
    left: 0,
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 9,
    image: "birds3.png",
    size: "contain",
    bottom: 100,
    left: 0,
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 8,
    image: "birds2.png",
    size: "contain",
    bottom: 100,
    left: 0,
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 7,
    image: "birds1.png",
    size: "contain",
    bottom: 100,
    left: 0,
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 2,
    float: false,
    image: "clouds.jpg",
    parralax: false,
    size: "cover",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
];

const LogIn: React.FC = () => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);

  const checkRef = useRef<(HTMLDivElement | null)[]>([]);

  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);
  const titleRef = useRef<HTMLSpanElement | null>(null);
  const timeline = useRef<gsap.core.Timeline | null>(null);
  const [isChecked, setIsChecked] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  const animateElements = () => {
    if (!timeline.current) {
      timeline.current = gsap.timeline({ paused: true });

      timeline.current
        .from(containerRef.current, {
          duration: 0.6,
          opacity: 0,
          y: 50,
          ease: "power3.out",
        })
        .from(inputsRef.current, {
          duration: 0.6,
          opacity: 0,
          x: -50,
          ease: "power3.out",
          stagger: 0.05,
          overwrite: "auto",
        })
        .from(checkRef.current, {
          duration: 0.6,
          opacity: 0,
          x: -50,
          ease: "power3.out",
          stagger: 0.05,
          overwrite: "auto",
        })
        .from(buttonsRef.current, {
          duration: 0.6,
          opacity: 0,
          y: 20,
          ease: "bounce.out",
          stagger: 0.05,
          overwrite: "auto",
        })
        .from(titleRef.current, {
          duration: 0.6,
          opacity: 0,
          y: -20,
          ease: "bounce.out",
          stagger: 0.05,
          overwrite: "auto",
        });
    }

    if (timeline.current) {
      timeline.current.play();
    }
  };

  useEffect(() => {
    setIsMounted(true);

    return () => {
      if (timeline.current) {
        timeline.current.kill();
      }
    };
  }, []);

  useEffect(() => {
    if (isMounted) {
      animateElements();
    }
  }, [isMounted]);

  const handleButtonHover = (button: HTMLButtonElement) => {
    gsap.to(button, {
      scale: 1.05,
      duration: 0.3,
      ease: "power2.out",
    });
  };

  const handleButtonLeave = (button: HTMLButtonElement) => {
    gsap.to(button, {
      scale: 1,
      duration: 0.3,
      ease: "power2.in",
    });
  };

  const handleButtonMouseDown = (button: HTMLButtonElement) => {
    gsap.to(button, {
      scale: 0.97,
      duration: 0.1,
      ease: "power1.in",
    });
  };

  const handleButtonMouseUp = (button: HTMLButtonElement) => {
    gsap.to(button, {
      scale: 1,
      duration: 0.2,
      ease: "power2.out",
    });
  };

  const inputClick = (index: number) => {
    if (inputsRef.current[index]) {
      gsap.to(inputsRef.current[index], {
        scale: 1.05,
        duration: 0.2,
        ease: "power1.out",
      });
    }
  };

  const inputBlur = (index: number) => {
    if (inputsRef.current[index]) {
      gsap.to(inputsRef.current[index], {
        scale: 1,
        duration: 0.2,
        ease: "power1.in",
      });
    }
  };

  useEffect(() => {
    buttonsRef.current.forEach((button) => {
      if (button) {
        button.addEventListener("mouseenter", () => handleButtonHover(button));
        button.addEventListener("mouseleave", () => handleButtonLeave(button));
        button.addEventListener("mousedown", () =>
          handleButtonMouseDown(button)
        );
        button.addEventListener("mouseup", () => handleButtonMouseUp(button));
      }
    });
    return () => {
      buttonsRef.current.forEach((button) => {
        if (button) {
          button.removeEventListener("mouseenter", () => {});
          button.removeEventListener("mouseleave", () => {});
          button.removeEventListener("mousedown", () => {});
          button.removeEventListener("mouseup", () => {});
        }
      });
    };
  }, []);
  const router = useRouter();

  return (
    <div
      ref={containerRef}
      className="flex flex-col md:flex-row border-solid border-black border-2"
      style={{
        backgroundColor: "#76adcc",
        width: "1000px",
      }}
    >
      <div
        className="border-black border-r-2 h-64 md:h-auto"
        style={{
          width: "100%",
        }}
      >
        <Paralax layers={layers2} width="100%" />
      </div>
      <div
        className="h-auto flex flex-col gap-5 p-5 rounded-2xl md:p-10 justify-center items-center"
        style={{
          width: "100%",
        }}
      >
        <span ref={titleRef} className="text-white text-4xl">
          Sign In
        </span>
        <div className="w-full flex flex-col gap-2">
          <div
            className="pl-3 flex h-14 flex-row w-full bg-white items-center border-black rounded-lg border-2"
            ref={(el) => {
              if (el) inputsRef.current[0] = el;
            }}
          >
            <img src="user.png" alt="User Icon" />
            <input
              placeholder="User Name"
              className="w-full h-full rounded-lg p-3 focus:outline-none focus:ring-0"
              onFocus={(e) => inputClick(0)}
              onBlur={() => inputBlur(0)}
            />
          </div>
          <div
            className="pl-3 flex h-14 flex-row w-full bg-white items-center border-black rounded-lg border-2"
            ref={(el) => {
              if (el) inputsRef.current[1] = el;
            }}
          >
            <img src="lock.png" alt="Lock Icon" />
            <input
              placeholder="Password"
              type="password"
              className="w-full h-full rounded-lg p-3 focus:outline-none focus:ring-0"
              onFocus={(e) => inputClick(1)}
              onBlur={() => inputBlur(1)}
            />
          </div>
          <div
            className="pl-3 flex h-14 flex-row w-full bg-white items-center border-black rounded-lg border-2"
            ref={(el) => {
              if (el) inputsRef.current[2] = el;
            }}
          >
            <img src="pw.png" alt="Lock Icon" />
            <input
              placeholder="Retype Password"
              type="password"
              className="w-full h-full rounded-lg p-3 focus:outline-none focus:ring-0"
              onFocus={(e) => inputClick(2)}
              onBlur={() => inputBlur(2)}
            />
          </div>
        </div>
        <AnimatedCheckbox
          ref={(el) => {
            if (el) checkRef.current[0] = el;
          }}
          checked={isChecked}
          setChecked={setIsChecked}
        />
        <div className="flex gap-2">
          <button
            ref={(el) => {
              if (el) buttonsRef.current[0] = el;
            }}
            onClick={() => {
              router.push("/home");
            }}
            className="bg-white gap-1 flex items-center rounded-lg pl-10 pr-10 pt-3 pb-3 font-bold border-black border-2"
          >
            <img src="sign.png" alt="Sign In Icon" />
            Sign In
          </button>
          <button
            ref={(el) => {
              if (el) buttonsRef.current[1] = el;
            }}
            onClick={() => {
              router.push("/login");
            }}
            className="bg-white flex gap-1 rounded-lg items-center pl-10 pr-10 pt-3 pb-3 font-bold border-black border-2"
          >
            <img src="log.png" alt="Log In Icon" />
            Log In
          </button>
        </div>
      </div>
    </div>
  );
};

export default LogIn;
