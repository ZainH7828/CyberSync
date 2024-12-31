import style from "./CategoryTypeBox.module.css";

const CategoryTypeBox: React.FC<categoryDataType> = ({ code, name, colorCode }) => {
  return (
    <div className={style.categoryBox}>
      <div
        className={style.symbol}
        style={{
          color: colorCode,
          backgroundColor: `${colorCode}1f`,
        }}
      >
        {code}
      </div>
      <div>{name}</div>
    </div>
  );
};

export default CategoryTypeBox;
