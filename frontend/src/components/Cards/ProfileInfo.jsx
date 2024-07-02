import React from "react";
import { getInitials } from "../../utils/nameInitials";

const ProfileInfo = ({ userInfo, onLogout }) => {
  // If userInfo is null or undefined, render nothing or a placeholder
  if (!userInfo) {
    return null; // Or return a placeholder component
  }

  return (
    <div className="flex items-center gap-3">
      <div className="w-12 h-12 flex items-center justify-center rounded-full text-slate-950 font-medium bg-slate-100">
        {getInitials(userInfo.name, userInfo.lastName)}
      </div>
      <div>
        <p className="text-sm font-medium">
          {userInfo.name + " " + userInfo.lastName}
        </p>
        <button className="text-sm text-slate-700 underline" onClick={onLogout}>
          Logout
        </button>
      </div>
    </div>
  );
};

export default ProfileInfo;
