import { useContext, useEffect, useState } from "react";
import Filter from "@/components/Dashboard/Filter";
import Heading from "@/components/Dashboard/Heading";
import popupStyle from "@/popups/Popup.module.css";
import tableStyle from "@/styles/table.module.css";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { DeleteIcon, EditIcon } from "@/icons";
import DeletePopup from "@/popups/DeletePopup";
import SimpleTable from "@/tables/SimpleTable";
import { PictureIcon } from "@/icons/dashboard";
import InviteTeamMembersRightsArea from "@/components/Onboarding/InviteTeamMembers";
import {
  assignUserSubcCategoryAPI,
  deleteUserAPI,
  fetchUserByOrganizationAPI,
  removeUserSubcCategoryAPI,
} from "../api/users";
import { MainContext } from "@/context";
import { useRouter } from "next/router";

const TeamMembers = () => {
  const context = useContext(MainContext);
  const router = useRouter();
  const { subCategory } = router.query;

  const subCategoryStr = Array.isArray(subCategory)
    ? subCategory[0]
    : subCategory;

  const tableHead = [
    "Name",
    "Email",
    "Role",
    ...(subCategoryStr ? ["Assignation"] : []),
  ];

  const tableKeys = [
    "name",
    "email",
    "role",
    ...(subCategoryStr ? ["assigned"] : []),
  ];

  const [filteredData, setFilteredData] = useState<userResponseDataType[]>([]);
  const [users, setUsers] = useState<userResponseDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<userResponseDataType>();
  const [editItem, setEditItem] = useState<userResponseDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);
  const [invitePopupVisibility, setInvitePopupVisibility] =
    useState<boolean>(false);

  const getSubCategoryName = () => {
    const categories = context?.userDashboard.data?.categories || [];
    for (const category of categories) {
      for (const subCat of category.subCategory) {
        if (subCat._id === subCategoryStr) {
          return subCat.name;
        }
      }
    }
    return null;
  };

  const subCategoryName = getSubCategoryName();

  const heading: DashhboardHeadingType = {
    heading: subCategoryName || "All Users",
    para: `${users.length} Members`,
    icon: <PictureIcon />,
    rightLink: {
      title: "Add Team Members",
      icon: faPlus,
      onClick: () => setInvitePopupVisibility(true),
    },
  };

  const onDeleteSelect = (item: userResponseDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onEditSelect = (item: userResponseDataType) => {
    setEditItem(item);
    setInvitePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteUserAPI(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getUsers();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  const onCancelDelete = () => {
    setDeletePopupVisibility(false);
  };

  const EditAction = ({ item }: { item: userResponseDataType }) => (
    <button type="button" onClick={() => onEditSelect(item)}>
      <EditIcon />
      <span>Edit</span>
    </button>
  );

  const DeleteAction = ({ item }: { item: userResponseDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  const getUsers = () => {
    const orgId =
      context && context.userData.value
        ? context.userData.value.organization
        : "";
    if (orgId) {
      fetchUserByOrganizationAPI(
        orgId,
        (data) => {
          const updatedUsers = data.map((user) => ({
            ...user,
            assigned: subCategoryStr
              ? user.subCategories.includes(subCategoryStr)
                ? "Assigned"
                : "Not Assigned"
              : "",
          }));
          setUsers(updatedUsers);
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  useEffect(() => {
    getUsers();
  }, [subCategoryStr]);

  const inviteSuccessHandler = () => {
    getUsers();
  };

  const onAssignUserHandler = (id: string) => {
    if (subCategoryStr) {
      assignUserSubcCategoryAPI(
        [
          {
            subCategoryID: subCategoryStr,
            userID: id,
          },
        ],
        () => {
          getUsers();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const onUnAssignUserHandler = (id: string) => {
    if (subCategoryStr) {
      removeUserSubcCategoryAPI(
        [
          {
            subCategoryID: subCategoryStr,
            userID: id,
          },
        ],
        () => {
          getUsers();
        },
        (err) => {
          console.error(err);
        }
      );
    }
  };

  const AssignAction = ({ item }: { item: userResponseDataType }) => (
    <button type="button" onClick={() => onAssignUserHandler(item._id)}>
      <span>Assign</span>
    </button>
  );

  const UnAssignAction = ({ item }: { item: userResponseDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onUnAssignUserHandler(item._id)}
    >
      <span>Unassign</span>
    </button>
  );

  const teamsPopupCloseHandler = () => {
    setInvitePopupVisibility(false);
    setEditItem(undefined);
  };

  return (
    <Layouts type="dashboard" pageName="Team Members">
      <Heading {...heading} />
      <Filter data={users} onFilterChange={setFilteredData} />
      <SimpleTable
        headings={tableHead}
        keys={tableKeys}
        data={filteredData}
        showActions
        actionComponents={
          subCategory
            ? [AssignAction, UnAssignAction]
            : [EditAction, DeleteAction]
        }
      />
      <DeletePopup
        data={{
          name: deleteItem ? deleteItem.name : "",
          deleteType: "user",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
      {invitePopupVisibility ? (
        <InviteTeamMembersRightsArea
          onInviteSuccess={inviteSuccessHandler}
          isPopup
          popupDetails={{
            visibility: invitePopupVisibility,
            toggleVisibility: teamsPopupCloseHandler,
            className: `${popupStyle.teamsPopup} text-start`,
          }}
          userData={editItem}
        />
      ) : null}
    </Layouts>
  );
};

export default TeamMembers;
