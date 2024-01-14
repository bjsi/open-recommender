import React from "react";
import { OnboardingModal } from "./OnboardingModal";
import { login } from "../lib/login";

interface LoginOnboardingModalProps {
  children: React.ReactNode;
  shouldOpen: boolean;
  hideClickShareStep?: boolean;
}

export function LoginOnboardingModal(props: LoginOnboardingModalProps) {
  return (
    <OnboardingModal
      shouldOpen={props.shouldOpen}
      cancelText="Not now"
      okayText="Login"
      title="Login with Twitter"
      content={<div>Login to Twitter to vote on recommendations</div>}
      onOkay={login}
    >
      {props.children}
    </OnboardingModal>
  );
}
