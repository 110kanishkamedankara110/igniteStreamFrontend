"use client";

import SelectionCard from "@/components/SelectionCard";
import { useRouter } from "next/navigation";
import { useRef } from "react";
const layers1 = [
  {
    zIndex: 12,
    image: "border1.jpg",
    parralax: false,
    size: "100% 100%",
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 10,
    image: "cloud1.jpg",
    size: "200px",
    bottom: -30,
    left: 130,
    width: "200px",
    height: "200px",
  },
  {
    zIndex: 9,
    image: "cloud2.jpg",
    size: "150px",
    rotate: "10deg",
    bottom: 50,
    left: 0,
    width: "150px",
    height: "150px",
  },
  {
    zIndex: 8,
    image: "dragon.gif",
    size: "90%",
    rotate: "15deg",
    top: 25,
    left: 20,
    width: "90%",
    height: "90%",
  },
  {
    zIndex: 7,
    float: true,
    image: "castle.jpg",
    parralax: true,
    size: "cover",
    bottom: 100,
    left: 100,
    width: "60%",
    height: "60%",
  },

  {
    zIndex: 6,
    image: "cloud3.jpg",
    size: "200px",
    top: 50,
    left: 0,
    width: "200px",
    height: "200px",
  },

  {
    zIndex: 5,
    image: "sun.jpg",
    size: "150px",
    top: 15,
    left: 0,
    width: "150px",
    height: "150px",
  },

  {
    zIndex: 3,
    image: "cloud2.jpg",
    size: "100px",
    rotate: "10deg",
    top: 50,
    right: 10,
    width: "100px",
    height: "100px",
  },

  {
    zIndex: 2,
    parralax: false,
    image: "day_bg.jpg",
    size: "cover",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
];

const layers2 = [
  {
    zIndex: 12,
    image: "border1.jpg",
    parralax: false,
    size: "100% 100%",
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 8,
    float: false,
    image: "knight.gif",
    size: "100% 100%",
    bottom: 20,
    width: "80%",
    height: "70%",
  },
  {
    zIndex: 7,
    image: "moon.jpg",
    size: "150px",
    rotate: "40deg",
    top: 15,
    left: 0,
    width: "150px",
    height: "150px",
  },
  {
    zIndex: 6,
    image: "cloud1.jpg",
    size: "200px",
    rotate: "10deg",
    top: 15,
    left: 80,
    width: "200px",
    height: "200px",
  },
  {
    zIndex: 5,
    image: "cloud2.jpg",
    size: "100px",
    rotate: "10deg",
    top: 50,
    right: 10,
    width: "100px",
    height: "100px",
  },
  {
    zIndex: 4,
    image: "cloud3.jpg",
    size: "200px",
    top: 50,
    left: 0,
    width: "200px",
    height: "200px",
  },
  {
    zIndex: 3,
    float: false,
    image: "house.jpg",
    parralax: false,
    size: "100% 100%",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "80%",
  },
  {
    zIndex: 2,
    parralax: false,
    image: "night_bg.jpg",
    size: "100%",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
];

const Home = () => {
  const card1 = useRef<HTMLDivElement>(null);
  const card2 = useRef<HTMLDivElement>(null);
  const router = useRouter();

  return (
    <div style={{
      backgroundColor:"#FFF5E0"
    }} className="w-full h-screen flex items-center justify-center gap-4 p-10 flex-col sm:flex-row">
      <SelectionCard
        ref={card1}
        onClick={() => {
          router.push("/login");
        }}
        label="Login"
        layers={layers1}
      />
      {/* <SelectionCard
        ref={card2}
        label="SignIn"
        layers={layers2}
        onClick={() => {
          router.push("/signin");
        }}
      /> */}
    </div>
  );
};

export default Home;
