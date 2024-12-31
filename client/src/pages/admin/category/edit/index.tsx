import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import SubCategoryUI from "../_partials/SubCategoryUI";

const SubCategoryEdit = () => {
  const searchPrams = useSearchParams();

  const [id, setId] = useState<string>();

  useEffect(() => {
    const tempId = searchPrams.get("id");

    setId(tempId ? tempId : "");
  }, [searchPrams]);

  return <SubCategoryUI id={id} isEdit />;
};

export default SubCategoryEdit;
