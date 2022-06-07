import React, { useRef, useCallback, useEffect, useContext } from "react";
import { SocketContext } from "@/contexts";
import AvatarDOM from "./AvatarDOM";
import { UserInfo, defaultUserInfo } from "@/contexts/UserInfoContext";
import { Draggable } from "@/components";

// for dragging and rendering avatars
function AvatarCanvas({
  userInfos,
  selfUserInfo,
  updateSelfUserInfo,
}: {
  userInfos: UserInfo[];
  selfUserInfo: UserInfo;
  updateSelfUserInfo: (any) => void;
}): JSX.Element {
  const { socket } = useContext(SocketContext);
  const selfPositionRef = useRef({ x: 100, y: 100 })

  // on mouse down, add listeners for moving and mouse up

  const updatePosition = useCallback((position: { x: number, y: number }) => {
    selfPositionRef.current = position
    updateSelfUserInfo({ position: [position.x, position.y] })
  }, [selfUserInfo])


  // returns a randomly generated pastel color
  const getColor = (random: number, lighteness: number, transparency: number) => {
    return "hsla(" + 360 * random + "," + (30 + 70 * random) + "%," + 70 * lighteness + "%, " + transparency + ")";
  };

  useEffect(() => {
    const random = Math.random();
    const background = getColor(random, 1, 1);
    const border = getColor(random, 1.2, 0.6);
    updateSelfUserInfo({ avatarColor: { background, border } });
  }, []);

  return (
    <>
      {
        userInfos.map((info, index) => {
          if (!info) {
            info = defaultUserInfo;
          }
          const isSelf = info.id === socket.id
          return (
            <Draggable
              key={index}
              position={
                isSelf ?
                  selfPositionRef.current :
                  { x: info.position[0], y: info.position[1] }
              }
              onPositionChange={updatePosition} draggable={isSelf}>
              <AvatarDOM
                key={index + 1}
                multiplier={info.multiplier}
                _backgroundColor={info.avatarColor.background}
                _borderColor={info.avatarColor.border}
                isSelf={isSelf}
                initial={info.name[0]}
                active={info.active}
                mute={info.mute}
              />
            </Draggable>
          );
        })
      }
    </>
  );
}

export default AvatarCanvas;
