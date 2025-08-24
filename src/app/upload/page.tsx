"use client";

import Paralax from "@/components/Paralax";
import gsap from "gsap";
import { useEffect, useRef, useState } from "react";

import axios from "axios";
import FormData from "form-data";
import { title } from "process";

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
    image: "shark.png",
    size: "contain",
    bottom: 100,
    left: 0,
    width: "100%",
    height: "100%",
  },
  {
    zIndex: 5,
    image: "bubbles.png",
    size: "contain",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
];

const Upload = () => {
  const inputsRef = useRef<(HTMLDivElement | null)[]>([]);
  const buttonsRef = useRef<(HTMLButtonElement | null)[]>([]);

  const titleRef = useRef<HTMLInputElement | null>(null);
  const descriptionRef = useRef<HTMLTextAreaElement | null>(null);

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
  const videoinput = useRef<HTMLInputElement>(null);
  const thumbnailinput = useRef<HTMLInputElement>(null);

  const [videoUrl, setVideoUrl] = useState("");

  const handleVideoSelection = () => {
    const file = videoinput.current?.files?.[0];
    if (file && file instanceof Blob) {
      setVideoUrl(URL.createObjectURL(file));
    }
  };
  const [imageUrl, setImageUrl] = useState("");

  const handleImageSelection = () => {
    const file = thumbnailinput.current?.files ? [0] : null;
    if (file && file instanceof Blob) {
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const uploadVideo = async (): Promise<void> => {
    const formData = new FormData();
    formData.append("title", titleRef.current?.value);
    formData.append("description", descriptionRef.current?.value);

    formData.append("videoFile", videoinput.current?.files?.[0]);

    if (imageUrl) {
      formData.append("thumbnail", thumbnailinput.current?.files?.[0]);
    }

    try {
      const response = await axios.post(
        "http://localhost:8080/api/v1/VideoService/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      console.log("Upload successful:", response.data);
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Upload failed:", error.response?.data || error.message);
      } else {
        console.error("Unexpected error:", error);
      }
    } finally {
      if (titleRef.current) {
        titleRef.current.value = "";
      }
      if (descriptionRef.current) {
        descriptionRef.current.value = ""; // Assign value only if descriptionRef.current exists
      }
      videoinput.current = null;
      thumbnailinput.current = null;
      setImageUrl("");
      setVideoUrl("");
    }
  };

  return (
    <div
      className="h-screen flex items-center justify-center"
      style={{
        backgroundColor: "#FFF5E0",
      }}
    >
      <div
        style={{
          width: "80%",
          height: "80%",
          position: "absolute",
        }}
      >
        <Paralax layers={layers2} width="100%" />
      </div>
      <div className="w-full min-h-60 flex flex-col md:flex-row p-10 gap-3 justify-center">
        <div className="h-40 md:h-auto md:w-1/4 bg-black/50 backdrop-blur-lg rounded-2xl flex-shrink-0 md:flex-grow"></div>

        <div className="flex flex-col w-full md:w-3/4 gap-3 h-auto md:h-auto">
          <div className="flex gap-3 w-full">
            <div
              onClick={() => videoinput.current?.click()}
              className="aspect-video w-1/2 bg-black/50 backdrop-blur-lg rounded-2xl items-center justify-center flex"
            >
              {!videoUrl && <img src="plus.png" />}
              <input
                onChange={handleVideoSelection}
                ref={videoinput}
                id="video"
                type="file"
                accept="video/*"
                hidden
              />
              {videoUrl && (
                <video className="rounded-2xl" controls width="600">
                  <source src={videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              )}
            </div>
            <div
              onClick={() => thumbnailinput.current?.click()}
              className="aspect-video w-1/2 bg-black/50 backdrop-blur-lg rounded-2xl items-center justify-center flex"
            >
              {!imageUrl && <img src="plus.png" />}
              <input
                onChange={handleImageSelection}
                ref={thumbnailinput}
                id="image"
                type="file"
                accept="image/*"
                hidden
              />
              {imageUrl && <img className="rounded-2xl h-fit" src={imageUrl} />}
            </div>
          </div>

          <div className="w-full bg-black/50 backdrop-blur-lg rounded-2xl p-5 flex flex-col gap-3 flex-grow">
            <div
              className="pl-3 flex h-14 flex-row w-full bg-white items-center border-black rounded-lg border-2"
              ref={(el) => {
                if (el) inputsRef.current[0] = el;
              }}
            >
              <img src="label.png" alt="Label Icon" />
              <input
                placeholder="Title"
                ref={titleRef}
                className="w-full h-full rounded-lg p-3 focus:outline-none focus:ring-0"
                onFocus={(e) => inputClick(0)}
                onBlur={() => inputBlur(0)}
              />
            </div>

            <div
              className="pl-3 flex h-fit flex-row w-full bg-white items-start pt-3 border-black rounded-lg border-2"
              ref={(el) => {
                if (el) inputsRef.current[1] = el;
              }}
            >
              <img src="scroll.png" width={32} alt="Label Icon" />
              <textarea
                ref={descriptionRef}
                placeholder="Description"
                className="w-full h-32 rounded-lg pl-3 pr-3 focus:outline-none focus:ring-0"
                onFocus={(e) => inputClick(1)}
                onBlur={() => inputBlur(1)}
              ></textarea>
            </div>

            <button
              ref={(el) => {
                if (el) buttonsRef.current[0] = el;
              }}
              onClick={() => uploadVideo()}
              className="bg-[#16C47F] text-white gap-1 flex items-center justify-center rounded-lg pl-10 pr-10 pt-3 pb-3 font-bold border-black border-2"
            >
              <img src="upload.png" alt="upload" />
              Upload
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Upload;
