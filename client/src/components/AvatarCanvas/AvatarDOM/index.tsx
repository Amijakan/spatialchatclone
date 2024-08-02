import React, { useState, useEffect, useCallback } from "react";
import { Icon } from "atomize";
import MicOffIcon from "@material-ui/icons/MicOff";
import cx from "classnames";
import muteSoundSrc from "@/assets/sound/mute.ogg";
import unmuteSoundSrc from "@/assets/sound/unmute.ogg";
import activeSoundSrc from "@/assets/sound/active.ogg";
import inactiveSoundSrc from "@/assets/sound/inactive.ogg";

import "./style.scss";

function AvatarDOM({
  isSelf,
  isAudible = false,
  _backgroundColor,
  _borderColor,
  initial,
  active,
  mute,
  size = "large",
  id,
  setSoundEffectPlayer
}: {
  isSelf: boolean;
  isAudible?: boolean;
  _backgroundColor: string;
  _borderColor: string;
  initial: string;
  active: boolean;
  mute: boolean;
  size?: string;
  id: string;
  setSoundEffectPlayer?: (arg0: HTMLAudioElement) => void;
}): JSX.Element {
  const [isRendered, setIsRendered] = useState(false);

  const avatarStyle = useCallback(() => {
    const boxShadow = isAudible ? "0 0 0 0.5rem " + _borderColor : "0 0 0 0 " + _borderColor;
    return {
      boxShadow,
      background: _backgroundColor,
    };
  }, [isAudible]);

  useEffect(() => {
    setIsRendered(true);
  }, []);

  useEffect(() => {
    if(isRendered) {
      if(mute) {
        setSoundEffectPlayer?.(new Audio(muteSoundSrc));
      }
      else {
        setSoundEffectPlayer?.(new Audio(unmuteSoundSrc));
      }
    }
  }, [mute]);

  useEffect(() => {
    if(isRendered) {
      if(active) {
        setSoundEffectPlayer?.(new Audio(activeSoundSrc));
      }
      else {
        setSoundEffectPlayer?.(new Audio(inactiveSoundSrc));
      }
    }
  }, [active]);

  function renderStatusIcon() {
    if (!active) {
      return <Icon className="active-icon" name="RemoveSolid" color="danger700" size="1.5rem" />;
    } else if (mute) {
      return <MicOffIcon />;
    }

    return null;
  }

  return (
    <div
      id={"avatar-" + id}
      className={cx("avatar", "avatar-outer", { "no-show": !isRendered })}
      data-size={size}
      data-self={isSelf && "self"}
      style={avatarStyle()}
    >
      <div className="avatar-initial">{initial}</div>
      <div className="avatar-active">{renderStatusIcon()}</div>
    </div>
  );
}

const areEqual = (prev, next) => {
  return (
    prev.active === next.active &&
    prev._backgroundColor === next._backgroundColor &&
    prev._borderColor === next._borderColor &&
    prev.initial === next.initial &&
    prev.active === next.active &&
    prev.mute === next.mute &&
    prev.isAudible === next.isAudible
  );
};

export default React.memo(AvatarDOM, areEqual);
