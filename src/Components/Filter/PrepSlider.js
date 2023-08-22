import { Slider } from "@mui/material";
import { handleSliders } from "../helpers/helpers";
import { useDispatch } from "react-redux";
import { setFilter } from "../slices/filterSlice";
import React, { useState } from "react";
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

  function PrepSlider() {
    const [prepTime, setPrepTime] = useState([0, 90])
    const dispatch = useDispatch()

    const handleChange = (e, newValue, activeThumb) => {
      const newValues = handleSliders(prepTime, newValue, activeThumb);
      setPrepTime(newValues);
      let [min,max] = newValues
      if (max === 90) max = null;
      else if (max === 0) max = 10;
      dispatch(setFilter({prepTime:[min,max]}))
    }

    return ( 
      <div>
        <Typography>Prep Time:</Typography>
        <Slider
          getAriaLabel={() => 'Prep time'}
          value={prepTime}
          max={90}
          valueLabelFormat={(value) => valueLabelFormat(value, "prepTime")}
          onChange={(e, newValue, activeThumb) => handleChange(e, newValue, activeThumb) }
          valueLabelDisplay="auto"
          getAriaValueText={valuetext}
          disableSwap
        />
      </div>
     );
}

export default PrepSlider;