import { useEffect, useState } from "react";
import Filter from "@/components/Dashboard/Filter";
import Heading from "@/components/Dashboard/Heading";
import tableStyle from "@/styles/table.module.css";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import {
  deleteOrganizationAPI,
  getOrganizationAPI,
} from "@/pages/api/organization";
import { DeleteIcon, EditIcon } from "@/icons";
import DeletePopup from "@/popups/DeletePopup";
import SimpleTable from "@/tables/SimpleTable";

const Dashboard = () => {
  const heading = {
    heading: "List of Organizations",
    rightLink: {
      link: routes.admin.organization.add,
      title: "Add New",
      icon: faPlus,
    },
  };

  const tableHead = ["Organization Name", "Organization Email", "License", "Status"];
  const tableKeys = ["name", "email", "licensePeriod", "status"];

  const [tableData, setTableData] = useState<organizationsDataType[]>([]);
  const [filteredData, setFilteredData] = useState<organizationsDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<organizationsDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const getOrganization = () => {
    getOrganizationAPI(
      (response) => {
        setTableData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const onDeleteSelect = (item: organizationsDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteOrganizationAPI(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getOrganization();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  const onCancelDelete = () => {
    setDeletePopupVisibility(false);
  };

  useEffect(() => {
    getOrganization();
  }, []);

  const EditAction = ({ item }: { item: organizationsDataType }) => (
    <Link href={`${routes.admin.organization.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: organizationsDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  return (
    <Layouts type="dashboard" pageName="Admin Dashboard">
      <Heading {...heading} />
      <Filter data={tableData} onFilterChange={setFilteredData} />
      <SimpleTable
        headings={tableHead}
        keys={tableKeys}
        data={filteredData}
        showSno
        showActions
        actionComponents={[EditAction, DeleteAction]}
      />
      <DeletePopup
        data={{
          name: deleteItem ? deleteItem.name : "",
          deleteType: "organization",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
    </Layouts>
  );
};

export default Dashboard;
