import { useContext, useEffect, useState } from "react";
import { Col, Row } from "react-bootstrap";
import { useSearchParams } from "next/navigation";
import Button from "@/elements/Button";
import Input from "@/elements/Input";
import AuthHeading from "@/layouts/AuthLayout/_partials/AuthHeading";
import Select from "@/elements/Select";
import Popup from "@/popups";
import Error from "@/elements/Error";
import routes from "@/routes";
import style from "@/styles/onboarding.module.css";
import { InviteIcon } from "@/icons/onboarding";
import { inviteUsersToOrganizationAPI, updateUserAPI } from "@/pages/api/users";
import { rolesKeys, userRoles } from "@/pageData/roles";
import { MainContext } from "@/context";
import { validateEmail } from "@/functions";
import { useRouter } from "next/router";

const InviteTeamMembersRightsArea: React.FC<
  InviteTeamMembersRightsAreaType
> = ({ isPopup = false, popupDetails, onInviteSuccess, userData }) => {
  const context = useContext(MainContext);

  const router = useRouter();

  const initialRights: userBasedRightsType = {
    categoryAdd: false,
    categoryEdit: false,
    taskAdd: false,
    taskEdit: false,
    downloadReport: false,
    manageTeam: false,
  };

  const searchParams = useSearchParams();
  const [invitePopup, setInvitePopup] = useState<boolean>(false);
  const [positionOptions, setPositionOptions] = useState<selectOptionsType[]>(
    []
  );
  const [selectedUserRoles, setSelectedUserRoles] = useState<selectOptionsType>(
    {
      label: "Select Position",
      value: "_",
      hidden: true,
    }
  );

  const [error, setError] = useState<string>("");

  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [designation, setDesignation] = useState<string>("");

  const [userRights, setUserRights] =
    useState<userBasedRightsType>(initialRights);

  const permissions = [
    { label: "Add Category", key: "categoryAdd" },
    { label: "Edit Category", key: "categoryEdit" },
    { label: "Add Task", key: "taskAdd" },
    { label: "Edit Task", key: "taskEdit" },
    { label: "Download Reports", key: "downloadReport" },
    { label: "Manage Teams", key: "manageTeam" },
  ];

  const resetForm = () => {
    setName("");
    setEmail("");
    setDesignation("");
    setSelectedUserRoles({
      label: "Select Position",
      value: "_",
      hidden: true,
    });
    setUserRights(initialRights);
  };

  const handleSelectChange = (selectedOption: selectOptionsType) => {
    setSelectedUserRoles(selectedOption);
    const selectedRole = userRoles.find(
      (role) => role.title === selectedOption.label
    );
    if (selectedRole) {
      setUserRights({
        categoryAdd: selectedRole.rights.category
          ? selectedRole.rights.category.add
          : false,
        categoryEdit: selectedRole.rights.category
          ? selectedRole.rights.category.edit
          : false,
        taskAdd: selectedRole.rights.task
          ? selectedRole.rights.task.add
          : false,
        taskEdit: selectedRole.rights.task
          ? selectedRole.rights.task.edit
          : false,
        downloadReport: selectedRole.rights.downloadReport
          ? selectedRole.rights.downloadReport
          : false,
        manageTeam: selectedRole.rights.manageTeam
          ? selectedRole.rights.manageTeam
          : false,
      });
    }
  };

  const handlePermissionToggle = (key: userBasedRightsKeyType) => {
    setUserRights((prevRights) => ({
      ...prevRights,
      [key]: !prevRights[key],
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    const event = e;
    event.preventDefault();
    const organization = searchParams.get("organization")
      ? searchParams.get("organization")
      : context?.userData.value?.organization;

    setError("");

    if (!validateEmail(email)) {
      setError("Enter a valid email");
      return;
    }

    if (selectedUserRoles.value === "_") {
      setError("Please select a role");
      return;
    }

    if (organization) {
      const data = {
        name: name,
        email: email.toLowerCase().trim(),
        organization: organization,
        role:
          selectedUserRoles.value !== rolesKeys.employee
            ? selectedUserRoles.value
            : designation.toLowerCase().replace(" ", "-"),
        rights: {
          category: {
            add: userRights.categoryAdd,
            edit: userRights.categoryEdit,
          },
          task: {
            add: userRights.taskAdd,
            edit: userRights.taskEdit,
          },
          downloadReport: userRights.downloadReport,
          manageTeam: userRights.manageTeam,
        },
      };
      if (userData) {
        updateUserAPI(
          userData._id,
          data,
          () => {
            if (onInviteSuccess) {
              onInviteSuccess();
            }

            popupDetails?.toggleVisibility();
            resetForm();
          },
          (err) => {
            setError(err);
          }
        );
      } else {
        inviteUsersToOrganizationAPI(
          data,
          () => {
            if (!invitePopup) {
              setInvitePopup(true);
            }

            resetForm();

            if (onInviteSuccess) {
              onInviteSuccess();
            }
          },
          (err) => {
            setError(err);
          }
        );
      }
    }
  };

  useEffect(() => {
    const temp = userRoles.map((roles) => ({
      label: roles.title,
      value: roles.value,
    }));

    const userTemp = [
      {
        label: "Select Position",
        value: "_",
        hidden: true,
      },
      ...temp,
    ];

    setPositionOptions(userTemp);

    if (userData) {
      setName(userData.name);
      setEmail(userData.email);
      setSelectedUserRoles({
        label: userData.role,
        value: userData.role,
      });
      setUserRights({
        categoryAdd: userData.rights.category?.add ?? false,
        categoryEdit: userData.rights.category?.edit ?? false,
        taskAdd: userData.rights.task?.add ?? false,
        taskEdit: userData.rights.task?.edit ?? false,
        downloadReport: userData.rights.downloadReport ?? false,
        manageTeam: userData.rights.manageTeam ?? false,
      });
    }
  }, [userData]);

  const successHandler = () => {
    if (popupDetails) {
      popupDetails.toggleVisibility();
    }
    setInvitePopup(false);
  };

  const FormContent = (
    <form onSubmit={handleSubmit}>
      <Row className="align-items-center">
        <Col md={isPopup ? 6 : 5}>
          <Row className="rowGap2">
            <Col xs={12}>
              <AuthHeading
                heading={`${userData ? "Update" : "Invite"} Team Members`}
                text={`${
                  userData
                    ? ""
                    : "Invite your team members for assigning tasks and tag categories to them."
                }`}
                className={`${isPopup ? `${style.popupHeading} mb-0` : ""}`}
              />
            </Col>
            <Col xs={12}>
              <Row className="rowGap2">
                <Col xs={12}>
                  <Input
                    type="text"
                    label="Enter Full Name"
                    value={name}
                    setValue={setName}
                    required
                  />
                </Col>
                <Col xs={12}>
                  <Input
                    type="email"
                    label="Enter Email"
                    value={email}
                    setValue={setEmail}
                    required
                    disabled={userData ? true : false}
                  />
                </Col>
                <Col xs={12}>
                  <Select
                    title="Position"
                    options={positionOptions}
                    value={selectedUserRoles.value}
                    onSelect={handleSelectChange}
                  />
                </Col>
                {selectedUserRoles.value === rolesKeys.employee ? (
                  <Col xs={12}>
                    <Input
                      type="text"
                      label="Enter Designation"
                      value={designation}
                      setValue={setDesignation}
                      required
                    />
                  </Col>
                ) : null}
                {error ? (
                  <Col xs={12}>
                    <Error error={error} />
                  </Col>
                ) : null}
                <Col xs={12}>
                  <Button type="submit" isFullWitdh>
                    {userData ? "Update" : "Send Invite"}
                  </Button>
                </Col>
                {!isPopup && (
                  <>
                    <Col md={6}>
                      <Button
                        theme="primary-light"
                        onClick={() => router.back()}
                        isFullWitdh
                      >
                        <span>Back</span>
                      </Button>
                    </Col>
                    <Col md={6}>
                      <Button
                        href={`${
                          routes.onBoarding.organization.assignCategoryToTeam
                        }?organization=${searchParams.get("organization")}`}
                        theme="primary-light"
                        isFullWitdh
                      >
                        <span>Skip for now</span>
                      </Button>
                    </Col>
                  </>
                )}
              </Row>
            </Col>
          </Row>
        </Col>
        <Col
          md={{
            span: isPopup ? 5 : 4,
            offset: isPopup ? 1 : 3,
          }}
        >
          <div className={style.userAccessContainer}>
            <h3>User Access</h3>
            <ul>
              {permissions.map((permission) => (
                <li key={permission.key}>
                  <p>{permission.label}</p>
                  <label className={style.switch}>
                    <input
                      type="checkbox"
                      checked={
                        userRights[permission.key as userBasedRightsKeyType]
                      }
                      onChange={() =>
                        handlePermissionToggle(
                          permission.key as userBasedRightsKeyType
                        )
                      }
                    />
                    <span className={style.slider}></span>
                  </label>
                </li>
              ))}
            </ul>
          </div>
        </Col>
      </Row>
    </form>
  );

  return (
    <>
      {isPopup ? (
        <Popup
          visibility={popupDetails ? popupDetails?.visibility : false}
          toggleVisibility={
            popupDetails ? popupDetails?.toggleVisibility : () => null
          }
          heading=""
          className={popupDetails?.className}
        >
          {FormContent}
        </Popup>
      ) : (
        FormContent
      )}

      {invitePopup && (
        <>
          <div className={style.invitePopupBg}></div>
          <div className={style.invitePopup}>
            <div className={style.imgArea}>
              <InviteIcon />
            </div>
            <div className={style.detailArea}>
              <h3>Invitation Send!</h3>
              <p>We have sent the invitation, Please check.</p>
            </div>
            <div className={style.btnArea}>
              <Button type={"button"} onClick={() => setInvitePopup(false)}>
                Invite More
              </Button>
              <Button
                href={
                  !isPopup
                    ? `${
                        routes.onBoarding.organization.assignCategoryToTeam
                      }?organization=${searchParams.get("organization")}`
                    : undefined
                }
                onClick={isPopup ? successHandler : undefined}
                theme="primary-outlined"
              >
                Later
              </Button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default InviteTeamMembersRightsArea;
