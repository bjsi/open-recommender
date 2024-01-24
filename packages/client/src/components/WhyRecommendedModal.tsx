import HelpOutline from "@mui/icons-material/HelpOutline";
import { OnboardingModal } from "./OnboardingModal";
import { Card, Collapse, Typography } from "@mui/material";
import clsx from "clsx";
import { RouterOutput } from "../lib/trpc";
import React from "react";

interface WhyRecommendedModalProps {
  video: RouterOutput["getRecommendations"][number];
}

export function WhyRecommendedModal(props: WhyRecommendedModalProps) {
  const [expanded, setExpanded] = React.useState(false);
  return (
    <OnboardingModal
      shouldOpen
      title="Why was this recommended?"
      content={
        <div>
          <div>
            Open Recommender created this summary of your interests based on
            your recent Tweets and any custom data you uploaded to your profile.
          </div>
          <Card className={clsx()} onClick={() => setExpanded(!expanded)}>
            <Collapse collapsedSize={200} in={expanded}>
              <Typography>{props.video.queries[0].summary.content}</Typography>
            </Collapse>
          </Card>
          <div>
            Open Recommender generated this search query based on your
            interests:
          </div>
          <div>"{props.video.queries[0].text}"</div>
          <div>
            Please DM feedback to{" "}
            <a href="https://twitter.com/experilearning">
              James (@experilearning)
            </a>
          </div>
        </div>
      }
      okayText="Ok"
    >
      <HelpOutline className="cursor-pointer" fontSize="small" />
    </OnboardingModal>
  );
}
