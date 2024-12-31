import { rolesKeys } from "@/pageData/roles";

export const getUserInitials = (name?: string) => {
  if (!name) return;

  const nameSplited = name.split(" ");

  if (nameSplited.length > 1) {
    return nameSplited[0][0].toUpperCase() + nameSplited[1][0].toUpperCase();
  } else {
    return nameSplited[0][0].toUpperCase();
  }
};

export const formatRolesTile = (value: string) => {
  switch (value) {
    case rolesKeys.companyAdmin:
      return "Company Admin";
    case rolesKeys.lineManager:
      return "Line Manager";
    case rolesKeys.supervisor:
      return "Supervisor";
    default:
      let name = value;

      name = name.replace("-", " ");
      name = name.replace("_", " ");

      return name.charAt(0).toUpperCase() + name.slice(1);
  }
};

export const validateEmail = (email: string) => {
  return email.match(
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  );
};
