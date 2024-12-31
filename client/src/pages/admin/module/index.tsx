import { useEffect, useState } from "react";
import Filter from "@/components/Dashboard/Filter";
import Heading from "@/components/Dashboard/Heading";
import tableStyle from "@/styles/table.module.css";
import Layouts from "@/layouts";
import routes from "@/routes";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import Link from "next/link";
import { DeleteIcon, EditIcon } from "@/icons";
import DeletePopup from "@/popups/DeletePopup";
import { deleteModuleAPI, getModuleAPI } from "@/pages/api/modules";
import SimpleTable from "@/tables/SimpleTable";

const Dashboard = () => {
  const heading = {
    heading: "List of Module",
    rightLink: {
      link: routes.admin.module.add,
      title: "Add New",
      icon: faPlus,
    },
  };

  const getModule = () => {
    getModuleAPI(
      (response: moduleDataType[]) => {
        setTableData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const tableHead = ["Module Name", "Status"];

  const [tableData, setTableData] = useState<moduleDataType[]>([]);
  const [filteredData, setFilteredData] = useState<moduleDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<moduleDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const onDeleteSelect = (item: moduleDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteModuleAPI(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getModule();
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
    getModule();
  }, []);

  const EditAction = ({ item }: { item: moduleDataType }) => (
    <Link href={`${routes.admin.module.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: moduleDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  const tableKeys = ["name", "status"];

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
          name: deleteItem ? deleteItem?.name : "",
          deleteType: "module",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
    </Layouts>
  );
};

export default Dashboard;
