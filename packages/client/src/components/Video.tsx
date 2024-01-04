import React, { useRef, useState } from "react";
import "./Video.css";
import { Avatar } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReactPlayer from "react-player";
import { IVideo } from "./testData";
import { ShareClipButton } from "./ShareClipButton";

interface VideoProps {
  setVideoRef: (ref: HTMLDivElement) => void;
  video: IVideo;
  inView: boolean;
}

export function Video(props: VideoProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState<-1 | 0 | 1>(0);
  const [notes, setNotes] = useState<string>("");
  const [isReady, setIsReady] = React.useState(false);

  const seekToStart = () => {
    const startSeconds = props.video.url.match(/t=(\d+)/)?.[1];
    if (startSeconds) {
      console.log("seeking to", startSeconds);
      playerRef.current?.seekTo(parseInt(startSeconds) - 2);
    }
  };

  const onReady = React.useCallback(() => {
    if (!isReady) {
      seekToStart();
      setIsReady(true);
      setPlaying(true);
    }
  }, [isReady, props.inView]);

  const isInitialPlay = React.useRef(true);

  return (
    <div className="video h-[100%]">
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
            onReady={onReady}
            onPlay={() => {
              // hack to get around YouTube's last play position memory
              if (isInitialPlay.current) {
                isInitialPlay.current = false;
                seekToStart();
              }
            }}
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
      <div className="w-[100%] p-4">
        <textarea
          title="notes"
          className="w-[100%] box-border p-2"
          placeholder="notes..."
          value={notes}
          onChange={(e) => {
            setNotes(e.target.value);
          }}
        />
      </div>
      <div className="shortsContainer">
        <div
          ref={props.setVideoRef}
          className="flex flex-row items-center shortsBottom"
        >
          <div>
            <div className="flex flex-row items-center gap-2 px-2 shortsDesc">
              <p className="text-xs sm:text-base description">
                {props.video.summary}
              </p>
              <div className="flex flex-col items-center gap-4">
                <ThumbUpIcon
                  onClick={() => setLiked(liked === 1 ? 0 : 1)}
                  fontSize="small"
                  color={liked === 1 ? "primary" : undefined}
                />
                <ThumbDownIcon
                  onClick={() => {
                    setLiked(liked === -1 ? 0 : -1);
                  }}
                  fontSize="small"
                  color={liked === -1 ? "primary" : undefined}
                />
                <ShareClipButton clip={props.video} notes={notes} />
              </div>
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
    </div>
  );
}
