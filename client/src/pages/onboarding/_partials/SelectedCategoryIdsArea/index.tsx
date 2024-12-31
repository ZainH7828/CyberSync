import { MainContext } from "@/context";
import { faTimes } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useContext } from "react";
import style from "@/styles/onboarding.module.css";
import { removeSubCategoriesToOrgAPI } from "@/pages/api/organization";

const SelectedCategoryIdsArea: React.FC<SelectedCategoryAreaType> = ({
  hideRemoveBtn = false,
  isInPopup = false,
}) => {
  const context = useContext(MainContext);

  const removeCategory = (index: number, id?: string) => {
    if (context) {
      const organization = context?.userData.value?.organization;
      if (isInPopup && organization && id) {
        removeSubCategoriesToOrgAPI(
          organization,
          id,
          () => {
            context.selectedSubCategoryIds.remove(index);
          },
          (err) => {
            console.error(err);
          }
        );
      } else {
        context.selectedSubCategoryIds.remove(index);
      }
    }
  };

  const getCategoryColor = (catID: string) => {
    const allCategories = [
      ...(context?.masterCategories ?? []),
      ...(context?.customCategory.value ?? []),
    ];
    const category = allCategories.find((cat) => cat._id === catID);
    return category ? category.colorCode : "#000";
  };

  return (
    <div className={style.detailArea}>
      <h3>Select Categories</h3>
      <div className={style.selectedCategory}>
        {context && context.selectedSubCategoryIds.value.length ? (
          context.selectedSubCategoryIds.value.map(
            (selectCategory, selectCategoryIndex) => (
              <div
                className={style.selectedCategoryItem}
                style={{
                  color: getCategoryColor(
                    selectCategory.category ? selectCategory.category : ""
                  ),
                  backgroundColor: `${getCategoryColor(
                    selectCategory.category ? selectCategory.category : ""
                  )}1f`,
                }}
                key={selectCategoryIndex}
              >
                <span>
                  {selectCategory.name}
                </span>
                {!hideRemoveBtn ? (
                  <button
                    type="button"
                    onClick={() =>
                      removeCategory(selectCategoryIndex, selectCategory._id)
                    }
                  >
                    <FontAwesomeIcon icon={faTimes} />
                  </button>
                ) : null}
              </div>
            )
          )
        ) : (
          <p className="opaque">No Category Selected</p>
        )}
      </div>
    </div>
  );
};

export default SelectedCategoryIdsArea;
