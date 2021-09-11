import React, { createContext, useReducer, useCallback } from "react";

interface PeerPosition {
  [key: string]: [number, number];
}

interface Action {
  type: string;
  id: string;
  position: [number, number];
}

export const PositionsContext = createContext<any>({});

export const PositionsProvider = ({ children }: { children: any }) => {
  // reducer for adding a avatar position to the list render
  const reducer = (peerPositions: PeerPosition, action: Action) => {
    switch (action.type) {
      case "add":
        return { ...peerPositions, [action.id]: action.position };
      case "remove": {
        const { [action.id]: _toRemove, ...removed } = peerPositions;
        return removed;
      }
      default:
        return peerPositions;
    }
  };
  const [peerPositions, dispatch] = useReducer<React.Reducer<PeerPosition, Action>>(reducer, {});
  // dispatching the action for adding a position
  const addAvatar = useCallback(
    (userId: string) => (position: [number, number]) => {
      dispatch({ type: "add", position: position, id: userId });
    },
    []
  );
  const removeAvatar = useCallback((userId: string) => {
    dispatch({ type: "remove", position: [0, 0], id: userId });
  }, []);
  return (
    <PositionsContext.Provider
      value={{
        peerPositions,
        addAvatar,
      }}
    >
      {children}
    </PositionsContext.Provider>
  );
};
