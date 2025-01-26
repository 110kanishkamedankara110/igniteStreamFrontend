import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";

const Header = () => {
  const [menuToggled, setMenuToggled] = useState(false);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [icon, setIcon] = useState("dots.svg");
  const router = useRouter();
  useEffect(() => {
    if (headerRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        duration: 0.5,
        height: menuToggled ? "auto" : 0,
        opacity: menuToggled ? 1 : 0,
        ease: "bounce.out",
        overflow: "hidden",
        visibility: menuToggled ? "visible" : "hidden", // Hide content when height is 0
      });
      setIcon(menuToggled ? "close.svg" : "dots.svg");
    }
  }, [menuToggled]);

  const ui = (
    <div className="rounded-full p-4 fixed top-0 left-0 z-50">
      <header className="rounded-full bg-white/50 backdrop-blur-lg">
        <div className="rounded-full">
          <div className="rounded-full flex justify-center items-center w-16 h-16">
            <img
              onClick={() => setMenuToggled(!menuToggled)}
              className="transition-transform duration-300 ease-out rounded-full cursor-pointer"
              src={icon}
              width={30}
              height={30}
              alt="dots"
            />
          </div>
        </div>
        <div ref={headerRef} className="w-16 rounded-b-full">
          {/* This will show/hide based on the height */}
          <div
            ref={contentRef}
            className="w-full justify-center items-center flex flex-col"
            style={{
              visibility: menuToggled ? "visible" : "hidden",
              opacity: menuToggled ? 1 : 0,
            }}
          >
            {/* Menu content or items that will animate */}
            <img
              className="rounded-full cursor-pointer mt-3 mb-3 hover:scale-150 transition-transform duration-300 ease-out"
              src="heart2.svg"
              width={30}
              height={30}
              alt="heart"
              title="Liked" // Tooltip text
            />

            <img
              className="rounded-full cursor-pointer mb-3 hover:scale-150 transition-transform duration-300 ease-out"
              src="user.svg"
              width={30}
              height={30}
              alt="user"
              title="User" // Tooltip text
            />
            <img
              className="rounded-full cursor-pointer mb-3 hover:scale-150 transition-transform duration-300 ease-out"
              src="bookmark.svg"
              width={30}
              height={30}
              alt="bookmark"
              title="saved" // Tooltip text
            />
            <img
              className="rounded-full cursor-pointer mb-3 hover:scale-150 transition-transform duration-300 ease-out"
              src="upload.svg"
              width={30}
              height={30}
              alt="upload"
              title="Upload"
              onClick={() => {
                router.push("/upload")
              }}
            />
          </div>
        </div>
      </header>
    </div>
  );

  return ui;
};

export default Header;
