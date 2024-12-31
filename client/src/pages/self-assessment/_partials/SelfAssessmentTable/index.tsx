import { faEllipsisVertical } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import style from "./SelfAssessmentTable.module.css";
import Link from "next/link";
import { DeleteIcon, EditIcon } from "@/icons";
import routes from "@/routes";
import { DownloadIcon } from "@/icons/sideBar";
import DeletePopup from "@/popups/DeletePopup";
import { useState } from "react";
import { deleteSelfAssessment } from "@/pages/api/self-assessment";

const SelfAssessmentTable: React.FC<{
  list: selfAssessmentResponseType[];
  getData: () => void;
}> = ({ list = [], getData = () => null }) => {
  const [deleteItem, setDeleteItem] = useState<selfAssessmentResponseType>();
  const [deletePopupVisibility, setDeletePopupVisibility] =
    useState<boolean>(false);

  const onDeleteSelect = (item: selfAssessmentResponseType) => {
    setDeleteItem(item);
    setDeletePopupVisibility(true);
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const ViewAction = ({ item }: { item: selfAssessmentResponseType }) => (
    <Link href={`${routes.users.selfAssessment.detail}?id=${item._id}`}>
      <DownloadIcon />
      <span>View</span>
    </Link>
  );

  const EditAction = ({ item }: { item: selfAssessmentResponseType }) => (
    <Link href={`${routes.users.selfAssessment.edit}?id=${item._id}`}>
      <EditIcon />
      <span>Edit</span>
    </Link>
  );

  const DeleteAction = ({ item }: { item: selfAssessmentResponseType }) => (
    <button
      type="button"
      className={style.danger}
      onClick={() => onDeleteSelect(item)}
    >
      <DeleteIcon />
      <span>Delete</span>
    </button>
  );

  const onConfirmDelete = () => {
    deleteSelfAssessment(
      deleteItem ? deleteItem._id : "",
      () => {
        setDeletePopupVisibility(false);
        getData();
      },
      (err) => {
        console.error(err);
      }
    );
  };

  const onCancelDelete = () => {
    setDeletePopupVisibility(false);
  };

  return (
    <>
      <div className={style.table}>
        <table>
          <thead>
            <tr>
              <th>Category</th>
              <th>Created At</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {list.map((item, index) => (
              <tr key={index}>
                <td>
                  {item.report[0].category.name} ({item.report[0].category.code}
                  )
                </td>
                <td>{formatDate(new Date(item.createdAt))}</td>
                <td className={style.actionsTd}>
                  <div className={style.actionsArea}>
                    <button type="button">
                      <FontAwesomeIcon icon={faEllipsisVertical} />
                    </button>
                    <ul>
                      <li>
                        <ViewAction item={item} />
                      </li>
                      <li>
                        <EditAction item={item} />
                      </li>
                      <li>
                        <DeleteAction item={item} />
                      </li>
                    </ul>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <DeletePopup
        data={{
          name: deleteItem ? deleteItem?.report[0].category.name : "",
          deleteType: "self assessment",
        }}
        visibility={deletePopupVisibility}
        toggleVisibility={onCancelDelete}
        onSuccess={onConfirmDelete}
      />
    </>
  );
};

export default SelfAssessmentTable;
