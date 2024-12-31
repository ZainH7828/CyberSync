"use client";

import Link from "next/link";
import style from "./Button.module.css";

const Button: React.FC<buttonType> = ({
  children,
  type = "button",
  className = "",
  theme = "primary",
  href,
  onClick,
  isFullWitdh = false,
  isLoading = false,
  disabled = false,
}) => {
  const getButtonClass = () => {
    switch (theme) {
      case "primary":
        return style.primary;
      case "primary-light":
        return style.primaryLight;
      case "primary-outlined":
        return style.primaryOutlined;
      case "primary-outlined-thin":
        return style.primaryOutlinedThin;
      case "danger":
        return style.danger;
      case "secondary":
        return style.secondary;
      case "tertiary":
        return style.tertiary;
      case "quaternary":
        return style.quaternary;
      default:
        return style.primary;
    }
  };

  const onClickHandler = () => {
    if (onClick) {
      onClick();
    }
  };

  const Component = href ? Link : "button";

  return (
    <Component
      type={type && !href ? type : undefined}
      href={href}
      className={`${style.button} ${getButtonClass()} ${
        isFullWitdh ? style.fullWidth : ""
      } ${className}`}
      onClick={onClickHandler}
      disabled={disabled || isLoading}
    >
      {children}
    </Component>
  );
};

export default Button;
