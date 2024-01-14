import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import React from "react";

interface OnboardingModalProps {
  children: React.ReactNode;
  shouldOpen: boolean;
  okayText: string;
  cancelText?: string;
  title: string;
  content: React.ReactNode;
  open?: boolean;
  onOkay?: () => void;
}

export function OnboardingModal(props: OnboardingModalProps) {
  const [isOpen, setOpen] = React.useState(!!props.open);
  React.useEffect(() => {
    setOpen(!!props.open);
  }, [props.open]);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  return (
    <>
      <span
        onClick={(e) => {
          if (props.shouldOpen) {
            e.stopPropagation();
            e.preventDefault();
            handleOpen();
          }
        }}
      >
        {props.children}
      </span>
      <Dialog open={isOpen} onClose={handleClose}>
        <DialogTitle>{props.title}</DialogTitle>
        <DialogContent>{props.content}</DialogContent>
        <DialogActions>
          {props.cancelText && (
            <Button onClick={handleClose}>{props.cancelText}</Button>
          )}
          <Button
            onClick={() => {
              props.onOkay?.();
              handleClose();
            }}
            autoFocus
            color="primary"
          >
            {props.okayText}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
