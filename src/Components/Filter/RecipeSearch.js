import React from "react";
import { TextField } from "@mui/material";
import { useDispatch } from "react-redux";
import { setFilter } from "../slices/filterSlice";
import { useState } from "react";

function RecipeSearch(){
  const dispatch = useDispatch();
  const [search,setSearch] = useState("")

  const handleChange = (e) => {
    const value = e.target.value
    setSearch(value)
    dispatch(setFilter({ name: value }));
  };

  return (
    <TextField
      id="outlined-basic"
      className="recipe-search"
      label="Search"
      variant="outlined"
      onChange={handleChange}
      value={search}
    />
  );
}

export default RecipeSearch;