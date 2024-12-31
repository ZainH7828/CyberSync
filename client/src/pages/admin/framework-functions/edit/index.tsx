import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import CategoryUI from "../_partials/CategoryUI";

const CategoryEdit = () => {
  const searchPrams = useSearchParams();

  const [id, setId] = useState<string>();

  useEffect(() => {
    const tempId = searchPrams.get("id");

    setId(tempId ? tempId : "");
  }, [searchPrams]);

  return <CategoryUI id={id} isEdit />;
};

export default CategoryEdit;
