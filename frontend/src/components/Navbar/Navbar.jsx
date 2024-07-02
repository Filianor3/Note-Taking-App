import React, { useState } from "react";
import ProfileInfo from "../Cards/ProfileInfo";
import { useNavigate } from "react-router-dom";
import SearchBar from "../Search/SearchBar";

const Navbar = ({ userInfo, handleSearch, onClearSearchBar }) => {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");

  const onLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleSearchClick = () => {
    if (search) {
      handleSearch(search);
    }
  };

  const handleClearSearchClick = () => {
    setSearch("");
    onClearSearchBar();
  };

  return (
    <div className="bg-white flex items-center justify-between px-6 py-2 drop-shadow">
      <h2 className="text-xl font-medium text-black py-2">Notes</h2>
      <SearchBar
        value={search}
        onChange={({ target }) => setSearch(target.value)}
        handleSearch={handleSearchClick}
        onClearSearchBar={handleClearSearchClick}
      />
      <ProfileInfo userInfo={userInfo} onLogout={onLogout} />
    </div>
  );
};

export default Navbar;
