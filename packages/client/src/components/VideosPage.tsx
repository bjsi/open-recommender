import React from "react";
import { Video } from "./Video";
import { useParams } from "react-router-dom";
import {
  GetRecommendationsInput,
  GetRecommendationsOutput,
} from "shared/schemas/getRecommendations";
import { RecommendationWithVotes } from "shared/schemas/recommendation";
import { useAuth } from "../lib/useAuth";

export function VideosPage() {
  const videosForUser = useParams().user as string;
  const auth = useAuth();
  const [clips, setClips] = React.useState<RecommendationWithVotes[]>();
  const loading = !clips;
  React.useEffect(() => {
    fetch(`http://localhost:3000/api/get-recommendations`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: videosForUser,
      } satisfies GetRecommendationsInput),
    })
      .then((res) => res.json())
      .then((data: GetRecommendationsOutput) => {
        setClips(data.recommendations);
      });
  }, [videosForUser]);

  const videoRefs = React.useRef<HTMLDivElement[]>([]);
  const [inViewIndex, setInViewIndex] = React.useState<number>(0);
  const appVideosRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    const observerOptions = {
      root: appVideosRef.current,
      rootMargin: "0px",
      threshold: 0.8, // Adjust this value to change the scroll trigger point
    };

    // This function handles the intersection of videos
    const handleIntersection = () => {
      setTimeout(() => {
        videoRefs.current.forEach((videoRef, index) => {
          const top = videoRef.getBoundingClientRect().top;
          console.log(top, window.innerHeight);
          if (top > 0 && top < window.innerHeight) {
            console.log(index, top, window.innerHeight);
            setInViewIndex(index);
          }
        });
      }, 1000);
    };

    const observer = new IntersectionObserver(
      handleIntersection,
      observerOptions
    );

    // We observe each video reference to trigger play/pause
    videoRefs.current.forEach((videoRef) => {
      observer.observe(videoRef);
    });

    // We disconnect the observer when the component is unmounted
    return () => {
      observer.disconnect();
    };
  }, [clips, appVideosRef.current]);

  // This function handles the reference of each video
  const handleVideoRef = (index: number) => (ref: HTMLDivElement) => {
    videoRefs.current[index] = ref;
  };

  if (!clips || clips.length === 0) {
    return <div>No clips found for user {videosForUser}</div>;
  }

  return (
    <div className="app">
      <div ref={appVideosRef} className="app__videos xl:max-w-[1200px]">
        {clips.map((vid, i) => (
          <Video
            auth={auth}
            setVideoRef={handleVideoRef(i)}
            video={vid}
            key={i}
            inView={inViewIndex === i}
          />
        ))}
      </div>
    </div>
  );
}
