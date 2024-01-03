import React from "react";
import { OnboardingModal } from "./OnboardingModal";
import shareBtnImgUrl from "./share-btn.png";
import composeTweetImgUrl from "./compose-tweet.png";

interface ShareClipOnboardingModalProps {
  children: React.ReactNode;
  shouldOpen: boolean;
  hideClickShareStep?: boolean;
}

export function ShareClipOnboardingModal(props: ShareClipOnboardingModalProps) {
  return (
    <OnboardingModal
      shouldOpen={props.shouldOpen}
      okayText="Got it!"
      title="Sharing Clips"
      content={
        <div>
          <ol className="space-y-6 font-bold list-decimal list-inside">
            {props.hideClickShareStep || (
              <li className="">
                Click share
                <div>
                  <img
                    className="max-w-[100%]"
                    alt="share button"
                    src={shareBtnImgUrl}
                  />
                </div>
              </li>
            )}
            <li>
              <span className="font-bold">Write your Tweet</span>
              <div>
                <img
                  alt="compose tweet"
                  className="max-w-[100%]"
                  src={composeTweetImgUrl}
                />
              </div>
            </li>
            <li>
              Include #openrecommender to share your tweet to other users'
              queues
            </li>
          </ol>
        </div>
      }
    >
      {props.children}
    </OnboardingModal>
  );
}
