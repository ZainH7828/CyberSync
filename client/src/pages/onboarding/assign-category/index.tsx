import Button from "@/elements/Button";
import Layouts from "@/layouts";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import {
  faAngleDown,
  faInfoCircle,
  faSearch,
  faTimes,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Col, Row } from "react-bootstrap";
import style from "@/styles/onboarding.module.css";
import Card from "@/components/Card";
import SelectedCategoryArea from "../_partials/SelectedCategoryArea";
import { useContext, useEffect, useRef, useState } from "react";
import { MainContext } from "@/context";
import { useSearchParams } from "next/navigation";
import { updateOrganizationAPI } from "@/pages/api/organization";
import { useRouter } from "next/router";
import routes from "@/routes";
import {
  assignUserSubcCategoryAPI,
  fetchUserByOrganizationAPI,
} from "@/pages/api/users";
import { formatRolesTile, getUserInitials } from "@/functions";

const AssignCategory = () => {
  const context = useContext(MainContext);
  const searchParams = useSearchParams();
  const router = useRouter();

  const [users, setUsers] = useState<userResponseDataType[]>([]);
  const [selectedUsersByCategory, setSelectedUsersByCategory] = useState<{
    [key: string]: userResponseDataType[];
  }>({});

  const assignCategoryHandler = () => {
    const orgId = searchParams.get("organization");
    if (orgId) {
      const dataToSubmit = Object.entries(selectedUsersByCategory).flatMap(
        ([subCategoryID, users]) =>
          users.map((user) => ({
            userID: user._id,
            subCategoryID,
          }))
      );

      const completeSetup = () => {
        updateOrganizationAPI(
          orgId,
          { setupCompleted: true },
          () => {
            router.push(routes.users.dashboard);
          },
          (err) => {
            console.error(err);
          }
        );
      };

      if (dataToSubmit.length) {
        assignUserSubcCategoryAPI(
          dataToSubmit,
          () => {
            completeSetup();
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
        completeSetup();
      }
    }
  };

  useEffect(() => {
    const orgId = searchParams.get("organization");
    if (orgId) {
      fetchUserByOrganizationAPI(
        orgId,
        (data) => {
          setUsers(data);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  }, [searchParams]);

  const updateSelectedUsers = (
    subCategoryID: string,
    selectedUsers: userResponseDataType[]
  ) => {
    setSelectedUsersByCategory((prev) => ({
      ...prev,
      [subCategoryID]: selectedUsers,
    }));
  };

  return (
    <Layouts type="onboarding" pageName="Assign Category">
      <Row className="rowGap6">
        <Col xs={12}>
          <Row className="align-items-center">
            <Col md={3}></Col>
            <Col md={6}>
              <AuthHeading
                heading="Assign Categories to Team Members"
                text="These categories are part of a broader framework that also includes various subcategories"
                isCenter
              />
            </Col>
            <Col md={3} className="text-right"></Col>
          </Row>
        </Col>
        <Col xs={12}>
          <Card>
            <Row className={style.cardArea}>
              <Col md={6}>
                <SelectedCategoryArea hideRemoveBtn />
              </Col>
              <Col
                md={{
                  offset: 1,
                  span: 5,
                }}
              >
                <ul className={style.assignCategoryUl}>
                  {context &&
                    context.selectedSubCategory.value.map(
                      (category, categoryIndex) => (
                        <CategoryItem
                          key={categoryIndex}
                          category={category}
                          users={users}
                          selectedUsers={
                            selectedUsersByCategory[category._id] || []
                          }
                          updateSelectedUsers={(selectedUsers) =>
                            updateSelectedUsers(category._id, selectedUsers)
                          }
                        />
                      )
                    )}
                </ul>
              </Col>
            </Row>
          </Card>
        </Col>

        <Col xs={12}>
          <Row className="rowGap">
            <Col xs={12} className="text-center">
              <div className={style.infoArea}>
                <FontAwesomeIcon icon={faInfoCircle} />
                <span>You can assign categories to Multiple Team Members</span>
              </div>
            </Col>

            <Col xs={12} className="text-center">
              <Button
                theme="primary-light"
                onClick={() => router.back()}
                className="me-3"
              >
                <span>Back</span>
              </Button>
              <Button type="button" onClick={assignCategoryHandler}>
                Next
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Layouts>
  );
};

const CategoryItem = ({
  category,
  users,
  selectedUsers,
  updateSelectedUsers,
}: {
  category: subCategoryDataType;
  users: userResponseDataType[];
  selectedUsers: userResponseDataType[];
  updateSelectedUsers: (selectedUsers: userResponseDataType[]) => void;
}) => {
  const userAreaRef = useRef<HTMLLIElement>(null);

  const [showUsers, setShowUsers] = useState(false);
  const [availableUsers, setAvailableUsers] =
    useState<userResponseDataType[]>(users);
  const [searchQuery, setSearchQuery] = useState("");

  const toggleShowUsers = () => {
    setShowUsers((prevShowUsers) => !prevShowUsers);
  };

  const closeUsersDrop = (e: MouseEvent) => {
    if (
      showUsers &&
      userAreaRef.current &&
      !userAreaRef.current.contains(e.target as Node)
    ) {
      setShowUsers(false);
    }
  };

  useEffect(() => {
    if (users) {
      setAvailableUsers(users);
    }
  }, [users]);

  useEffect(() => {
    document.addEventListener("mousedown", closeUsersDrop);

    return () => {
      document.removeEventListener("mousedown", closeUsersDrop);
    };
  }, [showUsers]);

  const addUserHandler = (user: userResponseDataType) => {
    const newSelectedUsers = [...selectedUsers, user];
    updateSelectedUsers(newSelectedUsers);
    setAvailableUsers((prevAvailableUsers) =>
      prevAvailableUsers.filter((u) => u._id !== user._id)
    );
    toggleShowUsers();
  };

  const removeUserHandler = (user: userResponseDataType) => {
    const newSelectedUsers = selectedUsers.filter((u) => u._id !== user._id);
    updateSelectedUsers(newSelectedUsers);
    setAvailableUsers((prevAvailableUsers) => [...prevAvailableUsers, user]);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredSelectedUsers = selectedUsers.filter((user) =>
    user.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <li ref={userAreaRef}>
      <div className={style.assignDetailContainer}>
        <div className={style.assignDetailArea} onClick={toggleShowUsers}>
          <FontAwesomeIcon icon={faUserPlus} />
          <span>{category.name}</span>
        </div>
        <div className={style.userRightArea}>
          {selectedUsers.length > 0 ? (
            <div className={style.selectedUsersArea}>
              <ul>
                {selectedUsers.slice(0, 2).map((item, index) => (
                  <li key={index}>
                    <div className={style.imgArea}>
                      <span>{getUserInitials(item.name)}</span>
                    </div>
                  </li>
                ))}
                {selectedUsers.length > 2 && (
                  <li key="more">
                    <div className={style.imgArea}>
                      <span>+{selectedUsers.length - 2}</span>
                    </div>
                  </li>
                )}
              </ul>
              <div className={style.selectedUserDropdown}>
                <div className={style.searchArea}>
                  <FontAwesomeIcon icon={faSearch} />
                  <input
                    type="text"
                    placeholder="Search User..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                  />
                </div>
                <ul>
                  {filteredSelectedUsers.length ? (
                    <>
                      {filteredSelectedUsers.map((user, userIndex) => (
                        <li key={userIndex}>
                          <div className={style.imgArea}>
                            {getUserInitials(user.name)}
                          </div>
                          <span>{user.name}</span>
                          <button
                            type="button"
                            onClick={() => removeUserHandler(user)}
                          >
                            <FontAwesomeIcon icon={faTimes} />
                          </button>
                        </li>
                      ))}
                    </>
                  ) : (
                    <li>
                      <p className="opaque">No users</p>
                    </li>
                  )}
                </ul>
              </div>
            </div>
          ) : null}
          <FontAwesomeIcon icon={faAngleDown} onClick={toggleShowUsers} />
        </div>
      </div>
      {showUsers && (
        <ul>
          {availableUsers.length ? (
            availableUsers.map((user, index) => (
              <li key={index} onClick={() => addUserHandler(user)}>
                <div className={style.imgArea}>
                  {getUserInitials(user.name)}
                </div>
                <span>
                  {user.name} ({formatRolesTile(user.role)})
                </span>
              </li>
            ))
          ) : (
            <li>
              <p>No users found</p>
            </li>
          )}
        </ul>
      )}
    </li>
  );
};

export default AssignCategory;
