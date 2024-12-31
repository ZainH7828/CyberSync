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
import { deleteCategoryAPI, getCategoryAPI } from "@/pages/api/category";
import SimpleTable from "@/tables/SimpleTable";

const Dashboard = () => {
  const heading = {
    heading: "List of Framework Functions",
    rightLink: {
      link: routes.admin.category.add,
      title: "Add New",
      icon: faPlus,
    },
  };

  const getCategory = () => {
    getCategoryAPI(
      (response: categoryDataType[]) => {
        setTableData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const tableHead = ["Framework Functions Name", "Code", "Status"];

  const [tableData, setTableData] = useState<categoryDataType[]>([]);
  const [filteredData, setFilteredData] = useState<categoryDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<categoryDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const onDeleteSelect = (item: categoryDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteCategoryAPI(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getCategory();
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
    getCategory();
  }, []);

  const EditAction = ({ item }: { item: categoryDataType }) => (
    <Link href={`${routes.admin.category.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: categoryDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  const tableKeys = ["name", "code", "status"];

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
          deleteType: "category",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
    </Layouts>
  );
};

export default Dashboard;
