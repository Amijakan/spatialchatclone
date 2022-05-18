import React from "react";
// Icon from https://icons8.com/icons/set/m
import { Div } from "atomize";
const Logo = ({ height = "20" }: { width?: string; height?: string }): JSX.Element => {
  return (
    <Div d="flex" p="0.7rem" align="center">
      <img
        style={{
          backgroundColor: "#ffffff88",
          borderRadius: 8,
          padding: 8,
        }}
        height={height}
        src="https://github.com/Amijakan/mochatto/blob/main/logo/logo_light.png?raw=true"
      />
    </Div>
  );
};

export default Logo;
