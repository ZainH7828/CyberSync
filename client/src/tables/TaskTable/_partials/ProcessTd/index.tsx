import style from "./ProcessTd.module.css";

const ProcessTd: React.FC<processTdPropType> = ({ color, progress }) => {
  return (
    <td className={style.progressTd}>
      <div className={style.progressArea} style={{ borderColor: color }}>
        <div
          className={style.progress}
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        >
          {progress}%
        </div>
      </div>
    </td>
  );
};

export default ProcessTd;
