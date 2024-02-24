import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";
import { trpc } from "../lib/trpc";
import { OnboardingModal } from "./OnboardingModal";

interface SettingsModalProps {
  children: React.ReactNode;
}

export function SettingsModal(props: SettingsModalProps) {
  const [isOpen, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [apiKey, setApiKey] = React.useState<{
    loading: boolean;
    data?: string;
  }>();
  return (
    <>
      <span
        onClick={(e) => {
          e.stopPropagation();
          e.preventDefault();
          handleOpen();
        }}
      >
        {props.children}
      </span>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>Settings</DialogTitle>
        <DialogContent>
          <div>
            {!apiKey ? (
              <Button
                disabled={!!apiKey}
                variant="outlined"
                onClick={async () => {
                  setApiKey({ loading: true });
                  const key = await trpc.getAPIKey.mutate();
                  if (!key) {
                    console.log("error getting api key");
                    return;
                  }
                  setApiKey({ loading: false, data: key });
                }}
              >
                Get API Key
              </Button>
            ) : (
              <div>
                Your API Key (
                <OnboardingModal
                  shouldOpen
                  okayText="Ok"
                  title="API Key"
                  content="This is your API key. You can use it to upload custom recommendation inputs and get recommendations programmatically. It's like a password, so don't share it with anyone. It will only be shown once. If you lose your key or accidentally share it, create a new API key. You can paste this into the RemNote Incremental Everything plugin to interleave your recommendations with existing elements."
                >
                  <a>What is this?</a>
                </OnboardingModal>
                ): <pre>{apiKey.data}</pre>
              </div>
            )}
          </div>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
