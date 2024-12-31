import React, { useState, useRef, useEffect } from "react";

interface CodeEntryFieldProps {
  onChange: (value: string) => void; // Callback for OTP change
  value: string;
}

const CodeEntryField: React.FC<CodeEntryFieldProps> = ({ onChange }) => {
  const [code, setCode] = useState(["", "", "", "", ""]);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleChange = (value: string, index: number) => {
    if (!/^\d*$/.test(value)) return;
    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);
    onChange(newCode.join("")); 

    // Combine the array into a single string and call the callback
    onChange(newCode.join(""));

    if (value && index < code.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleBackspace = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="otpContainer">
      {code.map((digit, index) => (
        <input
          key={index}
          type="text"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => handleBackspace(e, index)}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          className="otp"
        />
      ))}
    </div>
  );
};

export default CodeEntryField;
