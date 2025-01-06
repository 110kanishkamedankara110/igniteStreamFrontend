"use client";
import gsap from "gsap";
import React, { useRef, useState, useEffect } from "react";

interface MasonryItem {
  image: string;
  title: string;
  video?: string;
  id: Number;
}

interface MasonryLayoutProps {
  items: MasonryItem[];
}

const openDB = () => {
  return new Promise<IDBDatabase>((resolve, reject) => {
    const request = indexedDB.open("videoTimeDB", 1);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBRequest).result;
      if (!db.objectStoreNames.contains("videoTimes")) {
        db.createObjectStore("videoTimes", { keyPath: "id" });
      }
    };

    request.onsuccess = () => {
      resolve(request.result);
    };

    request.onerror = (error) => {
      reject(error);
    };
  });
};

const saveVideoTime = async (id: string, time: number, volume: number) => {
  try {
    const db = await openDB();
    const transaction = db.transaction("videoTimes", "readwrite");
    const store = transaction.objectStore("videoTimes");
    store.put({ id, time, volume });
  } catch (error) {
    console.error("Error saving video time", error);
  }
};

const getVideoTime = async (
  id: string
): Promise<{ time: number; volume: number }> => {
  return new Promise(async (resolve, reject) => {
    try {
      const db = await openDB();
      const transaction = db.transaction("videoTimes", "readonly");
      const store = transaction.objectStore("videoTimes");
      const request = store.get(id);

      request.onsuccess = () => {
        if (request.result) {
          resolve({ time: request.result.time, volume: request.result.volume });
        } else {
          resolve({ time: 0, volume: 1 });
        }
      };

      request.onerror = (error) => {
        reject(error);
      };
    } catch (error) {
      reject(error);
    }
  });
};

const hoverAnimation = (element: HTMLDivElement) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: 1.2,
    zIndex: 999999,
    duration: 0.5,
    ease: "power3.out",
  });
};

const resetAnimation = (element: HTMLDivElement) => {
  gsap.killTweensOf(element);
  gsap.to(element, {
    scale: 1,
    zIndex: 1,
    boxShadow: "0px 0px 0px rgba(0, 0, 0, 0)",
    duration: 0.3,
    ease: "power2.inOut",
  });
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ items }) => {
  const [hoverItem, setHoverItem] = useState<Number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutScaleId, setTimeoutScaleId] = useState<NodeJS.Timeout | null>(
    null
  );

  const videoRefs = useRef<HTMLVideoElement | null>(null);

  const handleVideoPlay = (
    videoElement: HTMLVideoElement,
    startTime: number
  ) => {
    if (videoElement) {
      videoElement.currentTime = startTime;
      videoElement.play();
    }
  };

  useEffect(() => {
    const video = videoRefs.current;
    if (video) {
      const id = video?.id;
      getVideoTime(id || "").then(({ time, volume }) => {
        handleVideoPlay(video, time);
        video.volume = volume;
      });
    }
  }, [hoverItem]);
  const [expanded, setExpanded] = useState(false);

  const handleClick = () => {
    setExpanded(!expanded);
  };
  return (
    <div className="columns-1 sm:columns-3 md:columns-4 lg:columns-6 gap-4">
      {/* <div
        style={{
          backgroundColor: "rgb(255 255 255 / 66%)",
        }}
        className="w-full h-full absolute z-50 top-0 left-0 flex justify-center items-center "
      >
        <div className="w-11/12 md:w-5/6 lg:w-5/6 xl:w-3/6 h-4/5 bg-white rounded-3xl border-2 border-black">
          <div
            className="w-full rounded-t-3xl bg-black relative"
            style={{
              aspectRatio: 16 / 7,
            }}
          >
            <div
              className="m-3 rounded-lg border-2 border-black right-0 absolute flex"
              style={{
                width: "30px",
                height: "30px",
                backgroundPosition: "center",
                backgroundImage: "url(close.svg)",
                backgroundSize: "80% 80%",
                backgroundColor: "rgb(255 255 255 / 66%)",
              }}
            ></div>
            <div
              className="m-3 rounded-full border-2 border-black absolute flex flex-col justify-center items-center"
              style={{
                width: "35px",
                height: expanded ? "110px" : "35px",
                backgroundColor: "rgb(255 255 255 / 66%)",
                transition: "height 0.5s ease, opacity 0.5s ease",
              }}
            >
              <img
                onClick={handleClick}
                className="rounded-full  cursor-pointer"
                src="dots.svg"
                width={25}
                height={25}
                alt="dots"
              />
              {expanded && (
                <div className="flex flex-col transition-all duration-500 ease-in-out">
                  <img
                    className="rounded-full  my-1 opacity-100"
                    src="heart.svg"
                    alt="close"
                    width={25}
                    height={25}
                  />
                  <img
                    className="rounded-full my-1 opacity-100"
                    src="bookmark.svg"
                    width={25}
                    height={25}
                    alt="close"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div> */}

      {items.map((item, index) => (
        <div
          id={`div${index}`}
          key={index}
          onMouseEnter={(e) => {
            hoverAnimation(e.currentTarget as HTMLDivElement);
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            const id = setTimeout(() => {
              setHoverItem(index);
            }, 2000);
            const scaleID = setTimeout(() => {
              const div = document.getElementById(`div${index}`);
              if (div) {
                div.style.scale = "1.5";
                div.style.transition = "0.5s";
              }
            }, 8000);
            setTimeoutScaleId(scaleID);
            setTimeoutId(id);
          }}
          onMouseLeave={(e) => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            if (timeoutScaleId) {
              clearTimeout(timeoutScaleId);
            }
            const id = `vid${item.id}`;
            if (videoRefs.current) {
              saveVideoTime(
                id,
                videoRefs.current.currentTime,
                videoRefs.current.volume
              );
            }
            const div = document.getElementById(`div${index}`);
            if (div) {
              div.style.scale = "1";
              div.style.transition = "0s";
            }
            resetAnimation(e.currentTarget as HTMLDivElement);
            setHoverItem(null);
          }}
          onTouchEnd={(e) => {
            if (timeoutId) {
              clearTimeout(timeoutId);
            }
            if (timeoutScaleId) {
              clearTimeout(timeoutScaleId);
            }
            const id = `vid${item.id}`;
            if (videoRefs.current) {
              saveVideoTime(
                id,
                videoRefs.current.currentTime,
                videoRefs.current.volume
              );
            }
            const div = document.getElementById(`div${index}`);
            if (div) {
              div.style.scale = "1";
              div.style.transition = "0s";
            }
            resetAnimation(e.currentTarget as HTMLDivElement);
            setHoverItem(null);
          }}
          className="mb-4 break-inside-avoid rounded-3xl border-black border-2 overflow-hidden relative group"
        >
          <button className="absolute m-4 right-0 top-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg bg-white text-black p-2">
            Save
          </button>
          {hoverItem === index ? (
            <video
              id={`vid${item.id}`}
              ref={(el) => {
                videoRefs.current = el;
              }}
              autoPlay
              className="absolute w-full h-full"
              controls
            >
              <source src={item.video} type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          ) : (
            ""
          )}
          <img
            src={item.image}
            alt={item.title}
            className="w-full rounded-3xl object-cover h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryLayout;
