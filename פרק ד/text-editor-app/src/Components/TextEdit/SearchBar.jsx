import React from "react";

function SearchBar({ searchTerm, setSearchTerm }) {
  return (
      <input
        type="text"
        placeholder="🔍 חפש תו..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />
  );
}

export default SearchBar;
