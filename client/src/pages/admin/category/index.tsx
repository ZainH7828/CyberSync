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
import {
  deleteSubCategoryAPI,
  getSubCategoryAPI,
} from "@/pages/api/sub-category";
import SimpleTable from "@/tables/SimpleTable";

const Dashboard = () => {
  const heading = {
    heading: "List of Category",
    rightLink: {
      link: routes.admin.subCategory.add,
      title: "Add New",
      icon: faPlus,
    },
  };

  const getSubCategory = () => {
    getSubCategoryAPI(
      (response: subCategoryDataType[]) => {
        setTableData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const tableHead = [
    "Category Name",
    "Framework Function",
    "Category Code",
    "Description",
    "Status",
  ];

  const [tableData, setTableData] = useState<subCategoryDataType[]>([]);
  const [filteredData, setFilteredData] = useState<subCategoryDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<subCategoryDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const onDeleteSelect = (item: subCategoryDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteSubCategoryAPI(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getSubCategory();
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
    getSubCategory();
  }, []);

  const EditAction = ({ item }: { item: subCategoryDataType }) => (
    <Link href={`${routes.admin.subCategory.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: subCategoryDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  const tableKeys = ["name", "code", "subCatCode", "description", "status"];

  return (
    <Layouts type="dashboard" pageName="Category">
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
          deleteType: "subCategory",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
    </Layouts>
  );
};

export default Dashboard;
