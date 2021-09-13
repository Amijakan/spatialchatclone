import React, { useState, useRef, useEffect, useContext} from "react";
import { SocketContext } from "../contexts/SocketIOContext";
import { PositionsContext } from "../contexts/PositionsContext";
import { DeviceSelector } from "../DeviceSelector";
import AvatarCanvas from "../AvatarCanvas";
import {
  addUserToNetwork,
  removeUserFromNetwork,
  updateAllTracks,
  sendOffer,
  openOfferListener,
  openAnswerListener,
  getUsers,
  updateAvatarPositions,
} from "../RTCPeerConnector";
import {
  notifyAndRequestNetworkInfo,
  openJoinListener,
  openLeaveListener,
  openRequestUsersListener,
} from "./RoomPageHelper";
import User from "../User";

import PropTypes from "prop-types";

function RoomPage({ name }: { name: string }): JSX.Element {
  const [announcement, setAnnouncement] = useState("");
  const { socket } = useContext(SocketContext);
  const { selfPosition, setSelfPosition, peerPositions, addAvatar, removeAvatar } =
    useContext(PositionsContext);
  const selfPositionRef = useRef(selfPosition);

  // when new input is selected update all tracks and send a new offer out
  const onSelect = (stream) => {
    updateAllTracks(stream.getAudioTracks()[0]);
    sendOffer(socket);
    console.debug(selfPosition);
  };

  const updateSelfPosition = (pos) => {
    selfPositionRef.current = pos;
    setSelfPosition(pos);
  }

  // announce and set a new user on join
  const onNewJoin = ({ name, id }) => {
    setAnnouncement(name + " has joined.");
    // if the id is not self, configure the new user and send offer
    if (id != socket.id) {
      setNewUser(id);
      sendOffer(socket, printPack);
    }
    // if it was self, print socketid
    else {
      console.debug(socket.id);
    }
  };

  // add a new position array in the peerPositions state
  // set the user setPosition callback to change the state
  // add the user
  const setNewUser = (userId) => {
    const user = new User(userId);
    user.setPosition = addAvatar(userId);
    user.setSelfPosition(selfPositionRef.current);
    addUserToNetwork(user);
  };

  const onLeave = (id: string) => {
    removeUserFromNetwork(id);
    removeAvatar(id);
  };

  const printPack = (pack) => {
    console.debug(pack);
  };

  // open all listeners on render
  useEffect(() => {
    notifyAndRequestNetworkInfo(socket, name);
    openJoinListener(socket, onNewJoin);
    openLeaveListener(socket, setAnnouncement, onLeave);
    openRequestUsersListener(socket, setNewUser);
    openOfferListener(getUsers(), socket);
    openAnswerListener(getUsers(), socket);
  }, []);

  // update remote position when avatar is dragged
  useEffect(() => {
    console.debug(selfPosition);
    updateAvatarPositions(selfPositionRef.current);
  }, [selfPosition]);

  return (
    <>
      <div>Room page</div>
      <div>Input selector</div>
      <DeviceSelector onSelect={onSelect} />
      <div>{announcement}</div>
      <AvatarCanvas
        selfPosition={selfPositionRef.current}
        setSelfPosition={updateSelfPosition}
        positions={Object.values(peerPositions)}
      />
    </>
  );
}

RoomPage.propTypes = {
  name: PropTypes.string,
};

export default RoomPage;
