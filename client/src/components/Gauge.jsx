import React from "react";
import ReactSpeedometer from "react-d3-speedometer";

const Gauge = ({ value, text, max }) => {
  return (
    <ReactSpeedometer
      minValue={0}
      maxValue={max}
      value={value}
      segments={3}
      segmentColors={["#00C49F", "#FFB347", "#FF6347"]}
      needleColor="#fff"
      currentValueText={text}
      height={200}
    />
  );
};

export default Gauge;
