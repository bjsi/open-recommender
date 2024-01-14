import React from "react";
import { faTwitterSquare } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import clsx from "clsx";
import { ShareClipOnboardingModal } from "./ShareClipOnboardingModal";
import { Recommendation } from "shared/schemas/recommendation";

interface ShareClipButtonProps {
  clip: Recommendation;
  notes: string;
}

function formatTweet(props: ShareClipButtonProps) {
  return encodeURIComponent(`${props.clip.data.title}\n\n${props.notes}\n\n`);
}

export function ShareClipButton(props: ShareClipButtonProps) {
  const sharePage = (url: string) => {
    window.open(url, "_blank");
  };

  return (
    <div
      onClick={(e) => {
        if (e.defaultPrevented) return;
        sharePage(
          `http://twitter.com/share?text=${formatTweet(props)}&url=${
            props.clip.data.url
          }`
        );
      }}
      className={clsx(`social-btn twitter cursor-pointer`)}
    >
      <ShareClipOnboardingModal shouldOpen>
        <span className="relative inline-flex">
          <FontAwesomeIcon size="lg" className="icon" icon={faTwitterSquare} />
          {props.notes.trim() && (
            <span className="absolute top-0 right-0 flex w-3 h-2 -mt-1 -mr-1">
              <span className="absolute inline-flex w-full h-full rounded-full opacity-75 animate-ping bg-sky-400"></span>
              <span className="relative inline-flex w-3 h-3 rounded-full bg-sky-500"></span>
            </span>
          )}
        </span>
      </ShareClipOnboardingModal>
    </div>
  );
}
