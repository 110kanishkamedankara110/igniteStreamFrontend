"use client";
import {
  MouseEvent,
  useCallback,
  useRef,
  useEffect,
  useState,
  forwardRef,
} from "react";
import { gsap } from "gsap";

type props = {
  layers: layer[];
  label: string;
  onClick?: () => void;
};

type layer = {
  zIndex: number;
  image: string;
  size: string;
  width?: string;
  height?: string;
  bottom?: number;
  top?: number;
  left?: number;
  right?: number;
  rotate?: string;
  float?: boolean;
  parralax?: boolean;
};

const SelectionCard = forwardRef<HTMLDivElement, props>(
  ({ layers, label, onClick }: props, ref) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const layersRef = useRef<(HTMLDivElement | null)[]>([]);
    const [isHovered, setIsHovered] = useState(false);

    useEffect(() => {
      layers.forEach((layer, idx) => {
        const layerElement = layersRef.current[idx];

        if (layerElement && layer.float !== false && !isHovered) {
          gsap.to(layerElement, {
            y: "+=" + (Math.random() * 20 - 10),
            yoyo: true,
            repeat: -1,
            duration: 3,
            ease: "sine.inOut",
          });
        } else if (layerElement) {
          gsap.killTweensOf(layerElement);
        }
      });
    }, [layers, isHovered]);

    const handleMouseMove = useCallback((e: MouseEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      layersRef.current.forEach((layer, index) => {
        if (layer) {
          const depth = index * 10;
          const offsetX = ((x - centerX) / rect.width) * depth;
          const offsetY = ((y - centerY) / rect.height) * depth;

          gsap.to(layer, {
            x: offsetX,
            y: offsetY,
            duration: 0.3,
            ease: "power1.out",
          });
        }
      });

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          rotationX: (y - centerY) / 10,
          rotationY: (x - centerX) / 10,
          duration: 0.1,
          ease: "power1.out",
        });
      }
    }, []);

    const handleMouseLeave = useCallback(() => {
      layersRef.current.forEach((layer) => {
        if (layer) {
          gsap.to(layer, {
            x: 0,
            y: 0,
            duration: 0.3,
            ease: "power1.out",
          });
        }
      });

      if (cardRef.current) {
        gsap.to(cardRef.current, {
          rotationX: 0,
          rotationY: 0,
          duration: 0.3,
          ease: "power1.out",
        });
      }

      setIsHovered(false);
    }, []);

    const handleMouseEnter = useCallback(() => {
      setIsHovered(true);
    }, []);

    const processedLayers = layers.map((layer) => ({
      ...layer,
      parralax: layer.parralax ?? true,
      float: layer.float ?? true,
    }));

    return (
      <div
        onClick={onClick}
        className="aspect-w-9 aspect-h-16 flex flex-col gap-3"
        style={{
          perspective: "1000px",
          width: 400,
          height: 600,
        }}
      >
        <div
          ref={cardRef}
          className="shadow-2xl w-full h-5/6 flex justify-center rounded-3xl relative"
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          onMouseEnter={handleMouseEnter}
          style={{
            perspective: "1000px",
          }}
        >
          <div className="w-full h-full flex justify-center relative">
            <div
              className="w-full h-full justify-center items-center rounded-lg flex absolute"
              style={{
                transformOrigin: "center center",
              }}
              ref={ref}
            >
              {processedLayers.map((layer, idx) => (
                <div
                  key={idx}
                  ref={
                    layer.parralax
                      ? (el) => {
                          layersRef.current[idx] = el;
                        }
                      : null
                  }
                  className="absolute rounded-lg"
                  style={{
                    zIndex: layer.zIndex,
                    backgroundImage: `url(${layer.image})`,
                    backgroundSize: layer.size,
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    width: layer.width,
                    height: layer.height,
                    bottom: layer.bottom,
                    right: layer.right,
                    left: layer.left,
                    top: layer.top,
                    rotate: layer.rotate,
                  }}
                />
              ))}

              <div
                className="absolute bg-blue-300 rounded-3xl"
                style={{
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                }}
              />
            </div>
          </div>
        </div>
        <div className="bg-white w-full h-fit border-black border-2 flex p-5 rounded-xl justify-center items-center">
          <h1 className="text-xl">{label}</h1>
        </div>
      </div>
    );
  }
);

export default SelectionCard;
