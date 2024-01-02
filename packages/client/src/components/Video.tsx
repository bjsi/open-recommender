import React, { useRef, useState } from "react";
import "./Video.css";
import { Avatar } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import NearMeIcon from "@mui/icons-material/NearMe";
import ReactPlayer from "react-player";
import { IVideo } from "./testData";

interface VideoProps {
  setVideoRef: (ref: HTMLDivElement) => void;
  video: IVideo;
  inView: boolean;
}

export function Video(props: VideoProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);

  React.useEffect(() => {
    if (props.inView) {
      console.log("in view");
      setPlaying(true);
      const startSeconds = props.video.url.match(/t=(\d+)/)?.[1];
      if (startSeconds) {
        playerRef.current?.seekTo(parseInt(startSeconds) - 2);
      }
    } else {
      console.log("out of view");
      setPlaying(false);
    }
  }, [props.inView]);

  return (
    <div className="video">
      {props.inView ? (
        <div className="player-wrapper">
          <ReactPlayer
            className="react-player"
            width={"100%"}
            height={"100%"}
            stopOnUnmount
            controls
            playing={playing}
            ref={playerRef}
            url={props.video.url}
          />
        </div>
      ) : (
        <div
          style={{
            width: "100%",
            height: "100%",
            backgroundColor: "black",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
          }}
        >
          loading...
        </div>
      )}
      <div className="shortsContainer">
        <div className="shortsVideoSideIcons">
          <div className="shortsVideoSideIcon">
            <ThumbUpIcon />
            <p>0</p>
          </div>
          <div className="shortsVideoSideIcon">
            <ThumbDownIcon />
            <p>0</p>
          </div>
          <div className="shortsVideoSideIcon">
            <NearMeIcon />
            <p></p>
          </div>
        </div>
        <div ref={props.setVideoRef} className="shortsBottom">
          <div className="shortsDesc">
            <p className="description">{props.video.summary}</p>
          </div>
          <div className="shortDetails">
            <Avatar
              src={
                "https://lh3.googleusercontent.com/ogw/ADGmqu8BCzU8GejYorGqXeu98A1kfEFYKFT85I3_9KJBzfw=s32-c-mo"
              }
            />
            <p>{props.video.title}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
