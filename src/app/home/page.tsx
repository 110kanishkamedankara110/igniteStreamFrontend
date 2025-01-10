"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import MasonryLayout from "@/components/MasonaryLayout";

interface MasonryItem {
  image: string;
  title: string;
  video?: string;
  id: number;
  primaryColor:string;
  secondaryColor:string;
}

const Home: React.FC = () => {
  const [items, setItems] =useState<MasonryItem[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    axios
      .get("http://localhost:8080/api/v1/VideoService/videos")
      .then((response) => {

        let data:MasonryItem[]=response.data

        data=data.map(item => {
          return {
            ...item,
            video: `http://localhost:8080/api/v1/VideoService/play?v=${item.video?.replaceAll('\\','/')}`,
            image: `http://localhost:8080/api/v1/VideoService/view?i=${item.image?.replaceAll('\\','/')}`
          };
        });
  
        setItems(data);
      })
      .catch((err) => {
        console.error("Error fetching videos:", err);
      });
  }, []);

  if (!isClient) {
    return null;
  }

  return (
    <div className="p-5">
      {items.length > 0 ? (
        <MasonryLayout items={items} />
      ) : (
        <div>Loading videos...</div>
      )}
    </div>
  );
};

export default Home;
