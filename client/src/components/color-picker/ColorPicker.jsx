import { HexColorPicker } from "react-colorful";
import { useState } from "react";

const ColorPickerBox = ({ label, color, onChange }) => {
//   const [color, setColor] = useState("#ffffff");
  const [showPicker, setShowPicker] = useState(false);

  return (
    <div className="color-picker">
      <label>Background Color</label>
      <div className="color-control">
        <div
          className="color-box"
          style={{ backgroundColor: color, cursor: "pointer" }}
          onClick={() => setShowPicker(!showPicker)}
        ></div>
        <span>{color.replace("#", "").toUpperCase()}</span>
        <span>100%</span>
      </div>

      {showPicker && (
        <div className="custom-color-palette">
          <HexColorPicker color={color} onChange={onChange} />
        </div>
      )}
    </div>
  );
};

export default ColorPickerBox;
