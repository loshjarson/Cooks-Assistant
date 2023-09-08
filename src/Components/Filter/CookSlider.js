import React from "react";
import { Slider } from "@mui/material";
import { handleSliders } from "../helpers/helpers";
import { useDispatch } from "react-redux";
import { setFilter } from "../slices/filterSlice";
import { useState } from "react";
import { Typography } from "antd";

function valuetext(value) {
    return `${value} min`;
  }
  
  const valueLabelFormat = (value) => {
    if (value === 90) {
      return '+90 min'
    } else {
      return `${value} min`
    }
  }


function CookSlider() {
    const [cookTime, setCookTime] = useState([0, 90])
    const dispatch = useDispatch()

    const handleChange = (e, newValue, activeThumb) => {
      const newValues = handleSliders(cookTime, newValue, activeThumb);
      setCookTime(newValues);
      let [min,max] = newValues
      if (max === 90) max = null;
      else if (max === 0) max = 10;
      dispatch(setFilter({cookTime:[min,max]}))
    }

    return ( 
      <div>
        <Typography>Cook Time:</Typography>
        <Slider
          getAriaLabel={() => 'Cook time'}
          value={cookTime}
          max={90}
          valueLabelFormat={(value) => valueLabelFormat(value, "cookTime")}
          onChange={(e, newValue, activeThumb) => handleChange(e, newValue, activeThumb) }
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
        />
      </div>
     );
}

export default CookSlider;