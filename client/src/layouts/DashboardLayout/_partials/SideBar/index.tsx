import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import style from "../../DashboardLayout.module.css";
import {
  faAdd,
  faAngleLeft,
  faArrowRightFromBracket,
  faBarsStaggered,
  faCaretDown,
  faCaretRight,
  faSearch,
} from "@fortawesome/free-solid-svg-icons";
import routes from "@/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { CategoryIcon, DashboardIcon } from "@/icons/sideBar";
import React, { useContext, useEffect, useState } from "react";
import LogoutPopup from "../LogoutPopup";
import { MainContext } from "@/context";
import SettingsArea from "../SettingsArea";
import constants from "@/constants";
import { getUserInitials } from "@/functions";
import { rolesKeys } from "@/pageData/roles";
import FrameworkToggle from "../FrameworkToggle";

const SideBar = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const context = useContext(MainContext);

  const [logoutVisibility, setLogoutVisibility] = useState(false);
  const [hideSidebar, setHideSidebar] = useState(context?.isMobile);
  const [searchQuery, setSearchQuery] = useState("");

  const adminLinks = [
    {
      title: "Dashboard",
      link: routes.admin.dashboard,
      svg: DashboardIcon,
    },
  ];

  const selfAssessmentLinks = [
    {
      title: "Self Assessment",
      link: routes.users.selfAssessment.main,
      svg: DashboardIcon,
    },
    {
      title: "Target Score",
      link: routes.users.targetScore.main,
      svg: CategoryIcon,
    },
  ];

  const toggleLogoutVisibility = () => {
    setLogoutVisibility(!logoutVisibility);
  };

  const toggleSidebar = () => {
    setHideSidebar(!hideSidebar);
  };

  useEffect(() => {
    if (context) {
      setHideSidebar(context.isMobile);
    }
  }, [context]);

  useEffect(() => {
    if (
      context &&
      context.userData &&
      context.userData.value?.role !== rolesKeys.superAdmin
    ) {
      context.userDashboard.get();
    }
  }, []);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value.toLowerCase());
  };

  const filterSubCategories = (categories: dashboardApiCategoryDataType[]) => {
    if (!searchQuery) {
      return categories;
    }

    return categories.map((category) => ({
      ...category,
      subCategory: category.subCategory.filter((subCategory) =>
        subCategory.name.toLowerCase().includes(searchQuery)
      ),
    }));
  };

  const onTaskRowClickHandler = (id: string) => {
    if (context) {
      context.taskHoveredAt.set(id);
    }
  };

  const filteredCategories = filterSubCategories(
    context?.userDashboard.data?.categories || []
  );

  return (
    <section className={`${style.sideBar} ${hideSidebar ? style.hidden : ""}`}>
      <div className={style.header}>
        {context?.userData.value?.role !== rolesKeys.superAdmin ? (
          <FrameworkToggle />
        ) : null}

        <img
          src={constants.appSettings.logo}
          alt={constants.appSettings.appName}
        />
        <button
          type="button"
          onClick={toggleSidebar}
          className={style.sidebarToggle}
        >
          <FontAwesomeIcon icon={hideSidebar ? faBarsStaggered : faAngleLeft} />
        </button>
      </div>
      <div className={style.body}>
        {pathname.startsWith(routes.admin.main) ? (
          <ul>
            {adminLinks.map((item, index) => (
              <li
                key={index}
                className={pathname === item.link ? style.active : undefined}
              >
                <Link href={item.link}>
                  {item.svg && <item.svg />}
                  <span>{item.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <>
            <div
              className={style.organizationDetail}
              onClick={() => router.replace(routes.users.dashboard)}
            >
              <span>{context?.organizationData.value?.name[0]}</span>
              <p>{context?.organizationData.value?.name}</p>
            </div>
            {!pathname.startsWith(routes.users.selfAssessment.main) ? (
              <>
                <div className={style.searchDetail}>
                  <div className={style.searchArea}>
                    <FontAwesomeIcon icon={faSearch} />
                    <input
                      type="text"
                      placeholder="Search"
                      value={searchQuery}
                      onChange={handleSearchChange}
                    />
                  </div>
                  {context?.userData.value?.rights.category?.add ? (
                    <Link href={routes.users.categoriesTask}>
                      <FontAwesomeIcon icon={faAdd} />
                    </Link>
                  ) : null}
                </div>
                {pathname.startsWith(routes.users.teamMembers) ? (
                  <ul className={`${style.userCategoryUl} ${style.userTeamUl}`}>
                    <li
                      className={
                        !searchParams.get("subCategory") &&
                        pathname === routes.users.teamMembers
                          ? style.active
                          : undefined
                      }
                    >
                      <Link href={routes.users.teamMembers}>
                        <span>All Users</span>
                      </Link>
                    </li>
                    {filteredCategories.map((catItem, catIndex) => (
                      <React.Fragment key={catIndex}>
                        {catItem.subCategory.map((subCatItem, subCatIndex) => (
                          <li
                            key={subCatIndex}
                            className={
                              searchParams.get("subCategory") === subCatItem._id
                                ? style.active
                                : undefined
                            }
                          >
                            <Link
                              href={`${routes.users.teamMembers}?subCategory=${subCatItem._id}`}
                            >
                              <span>{subCatItem.name}</span>
                            </Link>
                          </li>
                        ))}
                      </React.Fragment>
                    ))}
                  </ul>
                ) : (
                  <CategoryTaskList
                    filteredCategories={filteredCategories}
                    context={context}
                    pathname={pathname}
                    onTaskRowClickHandler={onTaskRowClickHandler}
                  />
                )}
              </>
            ) : (
              <ul>
                {selfAssessmentLinks.map((item, index) => (
                  <li
                    key={index}
                    className={
                      pathname === item.link ? style.active : undefined
                    }
                  >
                    <Link href={item.link}>
                      {item.svg && <item.svg />}
                      <span>{item.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
      <div className={style.footer}>
        {!pathname.startsWith(routes.admin.main) ? <SettingsArea /> : null}
        <div className={style.userDetailArea}>
          {logoutVisibility && (
            <LogoutPopup
              visibility={logoutVisibility}
              toggleVisibility={toggleLogoutVisibility}
            />
          )}
          <button type="button">
            <div className={style.userImgArea}>
              <span>{getUserInitials(context?.userData.value?.name)}</span>
            </div>
            <div className={style.detailArea}>
              <h3>{context?.userData.value?.name}</h3>
              <p>{context?.userData.value?.email}</p>
            </div>
          </button>
          <button
            type="button"
            className={style.logout}
            onClick={toggleLogoutVisibility}
          >
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
          </button>
        </div>
      </div>
    </section>
  );
};

export default SideBar;

type CategoryTaskListProps = {
  filteredCategories: dashboardApiCategoryDataType[];
  context: any;
  pathname: string;
  onTaskRowClickHandler: (id: string) => void;
};

const CategoryTaskList: React.FC<CategoryTaskListProps> = ({
  filteredCategories,
  context,
  pathname,
  onTaskRowClickHandler,
}) => {
  const [expandedCategories, setExpandedCategories] = useState<{
    [key: number]: boolean;
  }>({});
  const [expandedSubCategories, setExpandedSubCategories] = useState<{
    [key: string]: boolean;
  }>({});

  useEffect(() => {
    const initialExpandedCategories: { [key: number]: boolean } = {};
    const initialExpandedSubCategories: { [key: string]: boolean } = {};

    filteredCategories.forEach((category, index) => {
      initialExpandedCategories[index] = true; // Expand all categories by default
      category.subCategory.forEach((_, subIndex) => {
        initialExpandedSubCategories[`${index}-${subIndex}`] = true; // Expand all subcategories by default
      });
    });

    setExpandedCategories(initialExpandedCategories);
    setExpandedSubCategories(initialExpandedSubCategories);
  }, [filteredCategories]);

  const toggleCategory = (index: number) => {
    setExpandedCategories((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const toggleSubCategory = (categoryIndex: number, subIndex: number) => {
    setExpandedSubCategories((prev) => ({
      ...prev,
      [`${categoryIndex}-${subIndex}`]: !prev[`${categoryIndex}-${subIndex}`],
    }));
  };

  return (
    <ul className={style.userCategoryUl}>
      {filteredCategories.map((category, index) => (
        <li
          key={index}
          className={
            !context?.taskHoveredAt.value && index === 0
              ? style.active
              : undefined
          }
        >
          <p onClick={() => toggleCategory(index)}>
            <FontAwesomeIcon
              icon={expandedCategories[index] ? faCaretDown : faCaretRight}
            />
            <span>{category.name}</span>
          </p>
          {expandedCategories[index] && (
            <ul>
              {category.subCategory.map((subCategory, subIndex) => (
                <li key={subIndex}>
                  <p onClick={() => toggleSubCategory(index, subIndex)}>
                    <FontAwesomeIcon
                      icon={
                        expandedSubCategories[`${index}-${subIndex}`]
                          ? faCaretDown
                          : faCaretRight
                      }
                    />
                    <span>{subCategory.name}</span>
                  </p>
                  {expandedSubCategories[`${index}-${subIndex}`] &&
                    subCategory.tasks.length > 0 && (
                      <ul>
                        {subCategory.tasks.map((task, taskIndex) => (
                          <li
                            key={taskIndex}
                            className={
                              context?.taskHoveredAt.value === task._id
                                ? style.active
                                : undefined
                            }
                            onClick={() => onTaskRowClickHandler(task._id)}
                          >
                            <span>{task.name}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                </li>
              ))}
            </ul>
          )}
        </li>
      ))}
    </ul>
  );
};
