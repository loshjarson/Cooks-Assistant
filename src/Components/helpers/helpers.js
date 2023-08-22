export const recipeToFormData = (edits) => {
    const recipeFormData = new FormData()
    Object.entries(edits).forEach(([key, value]) => {
        //stringify objects and arrays to store in database
        if(key === "instructions" || key === "ingredients" || key === "tags"){
            recipeFormData.append(key, JSON.stringify(value))
        } else if (key === "image" && typeof value !== "string"){
            recipeFormData.append("image",value)
            console.log(value)
        } else if (key !== "image") {
            recipeFormData.append(key, value);
        }
    });
    return recipeFormData
}

//sets unique color for every word to have good looking tags
export const colorTag = (string) => {

    if(string.length === 0){
        return "#3c7ee8"
    }else{
        var sanitized = string.replace(/[^A-Za-z]/, '');
        var letters = sanitized.split('');
        if(letters.length < 1){
            return '#3c7ee8'
        }
        //Determine the hue
            var hue = Math.floor((letters[0].toLowerCase().charCodeAt()-96)/26*360);
            var ord = '';
            for(var i in letters){
                ord = letters[i].charCodeAt();
                if((ord >= 65 && ord <= 90) || (ord >= 97 && ord <= 122)){
                    hue += ord-64;
                }
            }

            hue = hue%360;

        //Determine the saturation
            var vowels = ['A', 'a', 'E', 'e', 'I', 'i', 'O', 'o', 'U', 'u'];
            var count_cons = 0;

            //Count the consonants
            for(i in letters){
                if(vowels.indexOf(letters[i]) === -1){
                    count_cons++;
                }
            }

            //Determine what percentage of the string is consonants and weight to 95% being fully saturated.
            var saturation = count_cons/letters.length/0.95*100;
            if(saturation > 100) saturation = 100;

        //Determine the luminosity
            var ascenders = ['t','d','b','l','f','h','k'];
            var descenders = ['q','y','p','g','j'];
            var luminosity = 50;
            var increment = 1/letters.length*40;

            for(i in letters){
                if(ascenders.indexOf(letters[i]) !== -1){
                    luminosity += increment;
                }else if(descenders.indexOf(letters[i]) !== -1){
                    luminosity -= increment*2;
                }
            }
            if(luminosity > 100) luminosity = 100;


            // Convert HSL to RGB
            var hslToRgb = (h, s, l) => {
                h /= 360;
                s /= 100;
                l /= 100;

                var r, g, b;

                if (s === 0) {
                    r = g = b = l; // achromatic
                } else {
                    var hue2rgb = (p, q, t) => {
                        if (t < 0) t += 1;
                        if (t > 1) t -= 1;
                        if (t < 1 / 6) return p + (q - p) * 6 * t;
                        if (t < 1 / 2) return q;
                        if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
                        return p;
                    };

                    var q = l < 0.5 ? l * (1 + s) : l + s - l * s;
                    var p = 2 * l - q;
                    r = hue2rgb(p, q, h + 1 / 3);
                    g = hue2rgb(p, q, h);
                    b = hue2rgb(p, q, h - 1 / 3);
                }

                var toHex = (c) => {
                    var hex = Math.round(c * 255).toString(16);
                    return hex.length === 1 ? "0" + hex : hex;
                };

                return "#" + toHex(r) + toHex(g) + toHex(b);
            };

            return hslToRgb(hue, saturation, luminosity);
    }
}

export const colorText = (backgroundHexColor) => {
    // Remove the '#' symbol from the background color string
    backgroundHexColor = backgroundHexColor.replace('#', '');
  
    // Convert the hex color to its RGB representation
    var r = parseInt(backgroundHexColor.substr(0, 2), 16);
    var g = parseInt(backgroundHexColor.substr(2, 2), 16);
    var b = parseInt(backgroundHexColor.substr(4, 2), 16);
  
    // Calculate the relative luminance of the background color
    var relativeLuminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
  
    // Calculate the contrast ratio with black (0, 0, 0)
    var contrastWithBlack = (relativeLuminance + 0.05) / .45;
  
    // Calculate the contrast ratio with white (255, 255, 255)
    var contrastWithWhite = (1.05) / (relativeLuminance + 0.05);
  
    // Determine the recommended font color based on the contrast ratios
    var fontColor = (contrastWithBlack > contrastWithWhite) ? '#000000' : '#ffffff';
  
    return fontColor;
  }

const minDistance = 10;  
export const handleSliders = (oldValue, newValue, activeThumb) => {
    if (!Array.isArray(newValue)) {
      return;
    }
    let [oldMin,oldMax] = oldValue
    let [newMin, newMax] = newValue
    
    //keep thumbs separated by specified distance
    if (activeThumb === 0) {
      return([Math.min(newMin, oldMax - minDistance), oldMax]);
    } else {
      return([oldMin, Math.max(newMax, oldMin + minDistance)]);
    }
   
  };

//check if recipe times are within the selected range
export const matchesRangeFilter = (filterValues, recipeValue) => {
    if (filterValues[0] !== 0 || filterValues[1] !== null) {
        return recipeValue >= filterValues[0] && recipeValue <= filterValues[1]
    }
    return true
}

//check if name matches search value
export const matchesNameFilter = (filterName, recipeName) => {
    if(filterName.length > 0){
        const search = filterName.toLowerCase()
        return recipeName.toLowerCase().includes(search)
    }
    return true
}
