import { useSearchParams } from "next/navigation";
import OrganizationUI from "../_partials/OrganizationUI";
import { useEffect, useState } from "react";

const OrganizationEdit = () => {
  const searchPrams = useSearchParams();

  const [id, setId] = useState<string>();

  useEffect(() => {
    const tempId = searchPrams.get("id");

    setId(tempId ? tempId : "");
  }, [searchPrams]);

  return <OrganizationUI id={id} isEdit />;
};

export default OrganizationEdit;
