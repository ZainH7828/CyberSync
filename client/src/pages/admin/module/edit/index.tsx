import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import ModuleUI from "../_partials/ModuleUI";

const ModuleEdit = () => {
  const searchPrams = useSearchParams();

  const [id, setId] = useState<string>();

  useEffect(() => {
    const tempId = searchPrams.get("id");

    setId(tempId ? tempId : "");
  }, [searchPrams]);

  return <ModuleUI id={id} isEdit />;
};

export default ModuleEdit;
