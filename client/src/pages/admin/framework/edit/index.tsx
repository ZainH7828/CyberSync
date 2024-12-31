import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import FrameworkUI from "../_partials/FrameworkUI";

const FrameworkEdit = () => {
  const searchPrams = useSearchParams();

  const [id, setId] = useState<string>();

  useEffect(() => {
    const tempId = searchPrams.get("id");

    setId(tempId ? tempId : "");
  }, [searchPrams]);

  return <FrameworkUI id={id} isEdit />;
};

export default FrameworkEdit;
