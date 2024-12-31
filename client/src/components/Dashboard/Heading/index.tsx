import Button from "@/elements/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "./Heading.module.css";

const Heading: React.FC<DashhboardHeadingType> = ({
  heading,
  para,
  icon,
  rightLink,
}) => {
  return (
    <div className={style.headingArea}>
      <div className={style.heading}>
        {icon ? <div className={style.imgArea}>{icon}</div> : null}
        <div className={style.headingDetail}>
          {heading ? <h1>{heading}</h1> : null}
          {para ? <p>{para}</p> : null}
        </div>
      </div>
      {rightLink && (
        <Button
          href={rightLink.link ? rightLink.link : undefined}
          onClick={rightLink.onClick ? rightLink.onClick : undefined}
          disabled={rightLink.disabled}
        >
          {rightLink.icon && <FontAwesomeIcon icon={rightLink.icon} />}
          <span>{rightLink.title}</span>
        </Button>
      )}
    </div>
  );
};

export default Heading;
