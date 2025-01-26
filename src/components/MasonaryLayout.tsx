"use client";
import gsap from "gsap";
import React, { useRef, useState, useEffect, useMemo } from "react";

interface MasonryItem {
  image: string;
  title: string;
  video?: string;
  id: Number;
  primaryColor: string;
  secondaryColor: string;
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
  element.style.scale = "1.2";
  element.style.zIndex = "99999";
  element.style.transition = "0.5s";
};

const resetAnimation = (element: HTMLDivElement) => {
  if (element != null) {
    element.style.scale = "1";
    element.style.zIndex = "1";
  }
};

const MasonryLayout: React.FC<MasonryLayoutProps> = ({ items }) => {
  const [hoverItem, setHoverItem] = useState<Number | null>(null);
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);
  const [timeoutScaleId, setTimeoutScaleId] = useState<NodeJS.Timeout | null>(
    null
  );

  type prev = {
    e: React.MouseEvent<HTMLDivElement, MouseEvent>;
    item: MasonryItem;
    index: number;
  };

  const [prev, setPrev] = useState<prev>();

  const [showVideo, setShowVideo] = useState(false);
  const [bgColor, setBgColor] = useState("rgb(255,255,255)");
  const [selectVideo, setSelectVideo] = useState("");
  const [selectVideoColor, setSelectVideoColor] = useState("");
  const [selectedVideoId, setSelectedVideoId] = useState("");
  const [videoLoaded, setVideoLoaded] = useState(false);
  const videoRefs = useRef<HTMLVideoElement | null>(null);
  const [playable, setPlayable] = useState(true);
  const [menuToggled, setMenuToggled] = useState(false);
  const headerRef = useRef(null);
  const contentRef = useRef(null);
  const [icon, setIcon] = useState("dots.svg");

  const memoizedBgColor = useMemo(() => bgColor, [bgColor]);

  const memoizedSelectVideoData = useMemo(
    () => ({ selectVideo, selectVideoColor }),
    [selectVideo, selectVideoColor]
  );

  const memoizedIcon = useMemo(() => icon, [icon]);

  useEffect(() => {
    if (headerRef.current && contentRef.current) {
      gsap.to(contentRef.current, {
        duration: 0.5,
        height: menuToggled ? "auto" : 0,
        opacity: menuToggled ? 1 : 0,
        ease: "bounce.out",
        overflow: "hidden",
        visibility: menuToggled ? "visible" : "hidden",
      });
      setIcon(menuToggled ? "close.svg" : "dots.svg");
    }
  }, [menuToggled]);

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

  useEffect(() => {
    const video = document.getElementById("mainPlayer") as HTMLVideoElement;
    if (video) {
      const id = selectedVideoId;
      getVideoTime(id || "").then(({ time, volume }) => {
        handleVideoPlay(video, time);
        video.volume = volume;
      });
    }
  }, [videoLoaded]);

  const resetVideo = (
    e:
      | React.MouseEvent<HTMLDivElement, MouseEvent>
      | React.TouchEvent<HTMLDivElement>,
    item: MasonryItem,
    index: number,
    video?: HTMLVideoElement
  ) => {
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
      div.style.boxShadow = "none";
    }
    resetAnimation(e.currentTarget as HTMLDivElement);
    setHoverItem(null);
    setBgColor("rgb(255,255,255)");
  };

  useEffect(() => {
    const handleVisibilityChange = () => {

      if (document.hidden) {
        setPlayable(false);
      if (prev) {
        resetVideo(prev.e, prev.item, prev.index);
      }
      } else {
        setPlayable(true);
      }


      
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, []);

  return (
    <div className="columns-1 sm:columns-3 md:columns-4 lg:columns-6 p-5 gap-2 rounded-2xl">
      <div
        style={{
          display: showVideo ? "flex" : "none",
        }}
        className="backdrop-blur-lg w-full h-full absolute z-50 top-0 left-0 flex justify-center items-center "
      >
        <div
          style={{
            backgroundColor: selectVideoColor,
          }}
          className="w-11/12 md:w-5/6 lg:w-5/6 xl:w-3/6 h-4/5 rounded-3xl "
        >
          <div
            className="w-full rounded-t-2xl bg-black relative"
            style={{
              aspectRatio: 16 / 7,
            }}
          >
            {selectVideo ? (
              <video
                id="mainPlayer"
                controls
                autoPlay
                className="absolute w-full h-full rounded-t-2xl"
              >
                <source src={selectVideo} type="video/mp4" />
              </video>
            ) : (
              ""
            )}
            <div
              className=" rounded-lg  absolute flex  bg-white/50 backdrop-blur-lg"
              style={{
                width: "30px",
                height: "30px",
                right: "10px",
                top: "10px",
                backgroundPosition: "center",
                backgroundImage: "url(close.svg)",
                backgroundSize: "80% 80%",
              }}
              onClick={() => {
                setPlayable(true);
                setShowVideo(false);
                setSelectVideo("");
                setSelectVideoColor("");
                setSelectedVideoId("");
                setVideoLoaded(false);
                const video = document.getElementById(
                  "mainPlayer"
                ) as HTMLVideoElement;

                saveVideoTime(selectedVideoId, video.currentTime, video.volume);
              }}
            ></div>
            <div
              className=" bg-white/50 backdrop-blur-lg m-3 rounded-full absolute flex flex-col justify-center items-center"
              style={{
                width: "35px",
              }}
            >
              <div className="rounded-full fixed top-0 left-0 z-50">
                <header className="rounded-full bg-white/50 backdrop-blur-lg">
                  <div className="rounded-full">
                    <div
                      className="rounded-full flex justify-center items-center"
                      style={{
                        width: "35px",
                        height: "35px",
                      }}
                    >
                      <img
                        onClick={() => setMenuToggled(!menuToggled)}
                        className="transition-transform duration-300 ease-out rounded-full cursor-pointer"
                        src={memoizedIcon}
                        width={"20px"}
                        height={"20px"}
                        alt="dots"
                      />
                    </div>
                  </div>
                  <div
                    ref={headerRef}
                    className=" rounded-b-full"
                    style={{
                      width: "35px",
                    }}
                  >
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
                        className="rounded-full cursor-pointer mb-2 mt-2 hover:scale-150 transition-transform duration-300 ease-out"
                        src="heart2.svg"
                        width={"20px"}
                        height={"20px"}
                        alt="heart"
                        title="Like" // Tooltip text
                      />
                      <img
                        className="rounded-full cursor-pointer mb-2 hover:scale-150 transition-transform duration-300 ease-out"
                        src="bookmark.svg"
                        width={"20px"}
                        height={"20px"}
                        alt="bookmark"
                        title="save" // Tooltip text
                      />
                    </div>
                  </div>
                </header>
              </div>
            </div>
          </div>
        </div>
      </div>

      {items.map((item, index) => (
        <div
          id={`div${index}`}
          key={index}
          style={{
            backgroundColor: item.primaryColor,
          }}
          onClick={(e) => {
            if (prev) {
              resetVideo(prev.e, prev.item, prev.index);
            }
            setPlayable(false);
            resetVideo(e, item, index);
            setSelectVideo(item.video || "");
            setShowVideo(true);

            let color = item.secondaryColor;
            color = color.replaceAll("rgb(", "");
            color = color.replaceAll(")", "");
            let colorarr = color.split(",");
            const r = colorarr[0];
            const g = colorarr[1];
            const b = colorarr[2];
            const a = 0.5;

            setSelectVideoColor(`rgba(${r},${g},${b},${a})`);

            setSelectedVideoId("vid" + item.id);
            setVideoLoaded(true);
          }}
          onMouseEnter={(e) => {
            if (prev) {
              resetVideo(prev.e, prev.item, prev.index);
            }
            setPrev({ e, item, index });
            if (playable) {
              let color = item.primaryColor;
              color = color.replaceAll("rgb(", "");
              color = color.replaceAll(")", "");
              let colorarr = color.split(",");
              const r = colorarr[0];
              const g = colorarr[1];
              const b = colorarr[2];
              const a = 0.5;

              setSelectVideoColor(`rgba(${r},${g},${b},${a})`);

              hoverAnimation(e.currentTarget as HTMLDivElement);
              if (timeoutId) {
                clearTimeout(timeoutId);
              }
              const id = setTimeout(() => {
                if (playable) {
                  const div = document.getElementById(`div${index}`);
                  if (div) {
                    div.style.boxShadow = `0px 0px 42px 20px ${selectVideoColor}`;
                  }
                  setHoverItem(index);
                }
              }, 2000);
              const scaleID = setTimeout(() => {
                if (playable) {
                  const div = document.getElementById(`div${index}`);
                  if (div) {
                    div.style.scale = "1.5";
                    div.style.transition = "0.5s";
                  }
                }
              }, 8000);
              setTimeoutScaleId(scaleID);
              setTimeoutId(id);

              setBgColor(item.primaryColor);
            } else {
              resetVideo(e, item, index);
            }
          }}
          onMouseLeave={(e) => {
            resetVideo(e, item, index);
          }}
          onTouchEnd={(e) => {
            resetVideo(e, item, index);
          }}
          className="break-inside-avoid mb-2 rounded-2xl overflow-hidden relative group"
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
            className="w-full  object-cover h-full"
          />
        </div>
      ))}
    </div>
  );
};

export default MasonryLayout;
