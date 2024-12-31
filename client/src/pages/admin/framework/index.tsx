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
import { deleteFrameworkAPI, getFrameworkAPI } from "@/pages/api/framework";
import SimpleTable from "@/tables/SimpleTable";

const Dashboard = () => {
  const heading = {
    heading: "List of Framework",
    rightLink: {
      link: routes.admin.framework.add,
      title: "Add New",
      icon: faPlus,
    },
  };

  const getFramework = () => {
    getFrameworkAPI(
      (response: frameworkDataType[]) => {
        setTableData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const tableHead = ["Framework Name", "Status"];

  const [tableData, setTableData] = useState<frameworkDataType[]>([]);
  const [filteredData, setFilteredData] = useState<frameworkDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<frameworkDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const onDeleteSelect = (item: frameworkDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteFrameworkAPI(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getFramework();
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
    getFramework();
  }, []);

  const EditAction = ({ item }: { item: frameworkDataType }) => (
    <Link href={`${routes.admin.framework.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: frameworkDataType }) => (
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
          deleteType: "framework",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
    </Layouts>
  );
};

export default Dashboard;
