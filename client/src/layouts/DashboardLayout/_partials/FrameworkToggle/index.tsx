import { MenuIcon } from "@/icons";
import { getModuleAPI } from "@/pages/api/modules";
import { useEffect, useRef, useState } from "react";
import style from "./FrameworkToggle.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheckSquare } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/router";
import routes from "@/routes";

const FrameworkToggle = () => {
  const [visibility, setVisibility] = useState<boolean>(false);
  const [modules, setModules] = useState<moduleDataType[]>([]);
  const [active, setActive] = useState<number>(0);

  const frameworkAreaRef = useRef<HTMLDivElement>(null);

  const router = useRouter();

  const closeFrameworkDrop = (e: MouseEvent) => {
    if (
      visibility &&
      frameworkAreaRef.current &&
      !frameworkAreaRef.current.contains(e.target as Node)
    ) {
      setVisibility(false);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", closeFrameworkDrop);

    return () => {
      document.removeEventListener("mousedown", closeFrameworkDrop);
    };
  }, [visibility]);

  useEffect(() => {
    getModuleAPI(
      (modules) => {
        setModules(modules);
      },
      (err) => {
        console.error(err);
      }
    );
  }, []);

  const applyHandler = () => {
    if (active === 0) {
      router.push(routes.users.dashboard);
    } else if (active === 1) {
      router.push(routes.users.selfAssessment.main);
    }

    setVisibility(false);
  };

  useEffect(() => {
    if (router.pathname.startsWith(routes.users.selfAssessment.main)) {
      setActive(1);
    }
  }, []);

  return (
    <>
      <button type="button" onClick={() => setVisibility(!visibility)}>
        <MenuIcon />
      </button>
      {visibility ? (
        <div className={style.dropDown} ref={frameworkAreaRef}>
          <ul>
            {modules.map((item, index) => (
              <li
                key={index}
                className={active === index ? style.active : ""}
                onClick={() => setActive(index)}
              >
                <FontAwesomeIcon icon={faCheckSquare} />
                <span>
                  {item.name}
                  {item.status !== "active" ? " (Coming Soon)" : ""}
                </span>
              </li>
            ))}
          </ul>
          <div className={style.btnArea}>
            <button type="button" onClick={applyHandler}>
              Apply
            </button>
          </div>
        </div>
      ) : null}
    </>
  );
};

export default FrameworkToggle;
