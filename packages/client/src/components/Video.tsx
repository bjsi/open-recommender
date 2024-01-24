import React, { useRef, useState } from "react";
import "./Video.css";
import { Avatar } from "@mui/material";
import ThumbUpIcon from "@mui/icons-material/ThumbUp";
import ThumbDownIcon from "@mui/icons-material/ThumbDown";
import ReactPlayer from "react-player";
import { ShareClipButton } from "./ShareClipButton";
import { LoginOnboardingModal } from "./LoginOnboardingModal";
import { updateNote } from "../lib/note";
import { voteOnRecommendation } from "../lib/votes";
import { AuthInfo, Authenticated } from "../lib/types";
import { RouterOutput } from "../lib/trpc";
import { TextareaAutosize } from "@mui/base/TextareaAutosize";
import { WhyRecommendedModal } from "./WhyRecommendedModal";

interface VideoProps {
  setVideoRef: (ref: HTMLDivElement) => void;
  video: RouterOutput["getRecommendations"][number];
  inView: boolean;
  auth: AuthInfo | undefined;
}

export function Video(props: VideoProps) {
  const playerRef = useRef<ReactPlayer>(null);
  const [playing, setPlaying] = useState(false);
  const [liked, setLiked] = useState<-1 | 0 | 1>(
    (props.auth?.authenticated
      ? props.video.recommendation.votes.find(
          (x) => x.userId === (props.auth as Authenticated).user.id
        )?.vote ?? 0
      : 0) as 0 | 1 | -1
  );

  async function handleVote(vote: -1 | 1 | 0) {
    if (props.auth?.authenticated) {
      const prevVote = liked;
      setLiked(vote);
      const serverRes = await voteOnRecommendation({
        recommendationId: props.video.recommendationId,
        vote: vote,
      });
      console.log(serverRes);
      if (serverRes === undefined) {
        setLiked(prevVote);
      } else {
        setLiked(serverRes === 1 ? 1 : serverRes === -1 ? -1 : 0);
      }
    }
  }

  async function handleUpdateNotes(content: string) {
    if (props.auth?.authenticated) {
      setNotes(content);
      const serverRes = await updateNote({
        recommendationId: props.video.recommendationId,
        content: content,
      });
      if (!serverRes) {
        console.log("failed to update note");
      }
    }
  }

  const [notes, setNotes] = useState<string>("");
  const [isReady, setIsReady] = React.useState(false);

  const seekToStart = () => {
    const startSeconds =
      props.video.recommendation.data.url.match(/t=(\d+)/)?.[1];
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
            url={props.video.recommendation.data.url}
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
        <TextareaAutosize
          title="notes"
          className="w-[100%] box-border p-2"
          placeholder="notes..."
          value={notes}
          onChange={(e) => {
            handleUpdateNotes(e.target.value);
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
              <p className="flex items-center gap-1 text-xs sm:text-base description">
                <div>{props.video.recommendation.data.summary}</div>
              </p>
              <div className="flex flex-col items-center gap-4">
                <LoginOnboardingModal shouldOpen={!props.auth?.authenticated}>
                  <ThumbUpIcon
                    onClick={() => {
                      if (props.auth?.authenticated) {
                        handleVote(liked === 1 ? 0 : 1);
                      }
                    }}
                    fontSize="small"
                    color={liked === 1 ? "primary" : undefined}
                  />
                </LoginOnboardingModal>
                <LoginOnboardingModal shouldOpen={!props.auth?.authenticated}>
                  <ThumbDownIcon
                    onClick={() => {
                      if (props.auth?.authenticated) {
                        handleVote(liked === -1 ? 0 : -1);
                      }
                    }}
                    fontSize="small"
                    color={liked === -1 ? "primary" : undefined}
                  />
                </LoginOnboardingModal>
                <ShareClipButton clip={props.video} notes={notes} />
                <WhyRecommendedModal video={props.video} />
              </div>
            </div>
            <div className="shortDetails">
              <Avatar
                src={
                  "https://lh3.googleusercontent.com/ogw/ADGmqu8BCzU8GejYorGqXeu98A1kfEFYKFT85I3_9KJBzfw=s32-c-mo"
                }
              />
              <p>{props.video.recommendation.data.title}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
