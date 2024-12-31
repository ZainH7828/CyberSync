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
import SimpleTable from "@/tables/SimpleTable";
import {
  deleteSubCategoryIDAPI,
  getSubCategoryIDAPI,
} from "@/pages/api/sub-category-ids";

const SubCategoryIds = () => {
  const heading = {
    heading: "List of Sub Category",
    rightLink: {
      link: routes.admin.subCategoryIds.add,
      title: "Add New",
      icon: faPlus,
    },
  };

  const getSubCategory = () => {
    getSubCategoryIDAPI(
      (response: subCategoryIdDataType[]) => {
        setTableData(response);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const tableHead = [
    "Sub Category",
    "Sub Category Code",
    "Description",
    "Status",
  ];

  const [tableData, setTableData] = useState<subCategoryIdDataType[]>([]);
  const [filteredData, setFilteredData] = useState<subCategoryIdDataType[]>([]);
  const [deleteItem, setDeleteItem] = useState<subCategoryIdDataType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const onDeleteSelect = (item: subCategoryIdDataType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const onConfirmDelete = () => {
    deleteSubCategoryIDAPI(
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

  const EditAction = ({ item }: { item: subCategoryIdDataType }) => (
    <Link href={`${routes.admin.subCategoryIds.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: subCategoryIdDataType }) => (
    <button
      type="button"
      className={tableStyle.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  const tableKeys = ["name", "subCode", "description", "status"];

  return (
    <Layouts type="dashboard" pageName="Sub Category">
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

export default SubCategoryIds;
