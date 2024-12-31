import style from "./AuthHeading.module.css";

const AuthHeading: React.FC<AuthHeadingType> = ({
  heading,
  text,
  className = "",
  isCenter = false,
}) => {
  return (
    <div
      className={`${style.authHeading} ${
        isCenter ? style.center : ""
      } ${className}`}
    >
      <h1>{heading}</h1>
      {text && <p>{text}</p>}
    </div>
  );
};

export default AuthHeading;
