import React from "react";
import {
  faWhatsappSquare,
  faFacebookF,
  faTwitterSquare,
} from "@fortawesome/free-brands-svg-icons";
import { faEnvelope } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Share() {
  const sharePage = (url) => {
    window.open(url.replace("[URL_FULL]", window.location.href), "_blank");
  };

  return (
    <>
      <div className="social-btns">
        {[
          {
            className: "twitter",
            icon: faTwitterSquare,
            url: "http://twitter.com/share?text=MY PROJECT&url=[URL_FULL]&hashtags=#MYPROJECT",
          },
          {
            className: "fb",
            icon: faFacebookF,
            url: "http://www.facebook.com/sharer.php?u=[URL_FULL]",
          },
          {
            className: "gmail",
            icon: faEnvelope,
            url: "https://mail.google.com/mail/?view=cm&fs=1&su=My Project&body=[URL_FULL]",
          },
          {
            className: "wa",
            icon: faWhatsappSquare,
            url: "whatsapp://send?&text=MY PROJECT [URL_FULL]",
          },
        ].map((sb, idx) => {
          return (
            <div
              key={idx}
              onClick={() => sharePage(sb.url)}
              className={`social-btn ${sb.className}`}
            >
              <FontAwesomeIcon className="icon" icon={sb.icon} />
              <div className="text">Share</div>
            </div>
          );
        })}
      </div>
      ;
    </>
  );
}
