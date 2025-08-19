// components/dashboard/dualslider.tsx
import React, { useState, useEffect } from "react";
import RangeSlider from "react-range-slider-input";
import "react-range-slider-input/dist/style.css";

interface MinMaxRangeProps {
  minAge: number;
  maxAge: number;
  onChange: (min: number, max: number) => void;
}

const MinMaxRange: React.FC<MinMaxRangeProps> = ({ minAge, maxAge, onChange }) => {
  const [values, setValues] = useState<[number, number]>([minAge, maxAge]);

  useEffect(() => {
    setValues([minAge, maxAge]);
  }, [minAge, maxAge]);

  const handleChange = (newValues: [number, number]) => {
    const min = Math.min(newValues[0], newValues[1]);
    const max = Math.max(newValues[0], newValues[1]);
    setValues([min, max]);
    console.log("Slider values:", [min, max]);
    onChange(min, max); // notify parent
  };

  return (
    <div>
      <RangeSlider
          min={0}
        max={100}
        step={1}
        value={values}
        onInput={handleChange}
        className="Slider"
      />
      <div style={{ textAlign: "center", marginTop: "5px", width: "100%" }}>
        Min: {values[0]} | Max: {values[1]}
      </div>
    </div>
  );
};

export default MinMaxRange;
