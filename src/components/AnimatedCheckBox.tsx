import React, { forwardRef } from "react";

interface Props {
  checked: boolean;
  setChecked: (value: boolean) => void;
}

const AnimatedCheckbox = forwardRef<HTMLDivElement, Props>(
  ({ checked, setChecked }, ref) => {
    const handleChange = () => {
      setChecked(!checked);
    };

    return (
      <div ref={ref} className="flex items-center gap-3">
        <label className="relative flex cursor-pointer">
          <input
            onChange={() => {
              handleChange();
            }}
            type="checkbox"
            checked={checked}
            className="hidden"
          />
          <span
            className={`w-7 h-7 flex items-center border-black  justify-center border-2 rounded-md transition-all duration-300`}
            style={
              checked
                ? { backgroundColor: "#f5d800" }
                : { backgroundColor: "white" }
            }
          >
            {checked ? <img src="smile.svg" alt="Smiley" /> : ""}
          </span>
        </label>
        <span className="text-white text-sm">
          <span
            className="cursor-pointer text-lg"
            onClick={() => {
              handleChange();
            }}
          >
            Agree to{" "}
          </span>
          <a
            href="#"
            className="text-white underline text-lg transition-colors"
          >
            terms and conditions
          </a>
        </span>
      </div>
    );
  }
);

export default AnimatedCheckbox;
