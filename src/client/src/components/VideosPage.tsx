import React from "react";
import { userClipsMap } from "../data/testData";
import { Video } from "./Video";
import { useParams } from "react-router-dom";

export function VideosPage() {
  const user = useParams().user as string;
  const clips = userClipsMap[user];
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
    return <div>No clips found for user {user}</div>;
  }

  return (
    <div className="app">
      <div ref={appVideosRef} className="app__videos">
        {clips.map((vid, i) => (
          <Video
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
