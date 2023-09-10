import React from 'react';
import { Box } from '@mui/material'
import PrepSlider from './PrepSlider';
import CookSlider from './CookSlider';
import TotalSlider from './TotalSlider';
import FilterableIngredients from './FilterableIngredients';
import FilterableTags from './FilterableTags';

function Filter() {

  return (
    <div id="filter-container">
      <Box id="slider-container">
        <PrepSlider/>
        <CookSlider/>
        <TotalSlider/>
      </Box>
      <Box className="filter-selections">
        <Box className="filter-selection-container">
          <FilterableTags/>
        </Box>
        <Box className="filter-selection-container">
          <FilterableIngredients/>
        </Box>
      </Box>
    </div>
  );
}

export default Filter;