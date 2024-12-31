import style from "./Card.module.css";

const Card: React.FC<ChildrenProps> = ({children}) => {
  return (
    <div className={style.card}>
      {children}
    </div>
  );
}

export default Card;