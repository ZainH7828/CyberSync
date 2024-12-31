import style from "./Input.module.css";

const Input: React.FC<InputType> = ({
  placeholder,
  type = "text",
  label,
  name,
  autoComplete,
  required = false,
  value,
  setValue,
  onChange,
  className = "",
  disabled = false,
}) => {
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange) {
      onChange(e.target.value);
    }
    if (setValue) {
      setValue(e.target.value);
    }
  };

  const checkboxOrRadio = type === "checkbox" || type === "radio";

  return (
    <div
      className={`${style.inputArea} ${
        checkboxOrRadio ? style.checkboxOrRadioArea : ""
      } ${className}`}
    >
      {checkboxOrRadio ? <input type={type} id={name} /> : null}
      {label && <label htmlFor={name}>{label}</label>}
      {!checkboxOrRadio ? (
        <input
          type={type}
          name={name}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          value={value}
          onChange={handleInputChange}
          className={style.input}
          disabled={disabled ? true : undefined}
        />
      ) : null}
    </div>
  );
};

export default Input;
