import React from "react";
import { ShareData } from "../../data/share";
import { NavLink } from "react-router-dom";

const Share = () => {
  return (
    <div className="flex flex-col w-full space-y-4 justify-between px-4 py-4 bg-white rounded-xl">
      {ShareData.map((share, index) => (
        <NavLink
          key={index}
          className="flex items-center justify-between py-4 "
          to={share.route}
        >
          <div className="flex items-center space-x-2">
            <img src={share.img} alt={share.title} className="w-6 h-6 " />
            <span className="font-normal text-md">{share.title}</span>
          </div>
          <img src={"chevronr.svg"} alt="" />
        </NavLink>
      ))}
    </div>
  );
};

export default Share;
