import getToken from "@/functions/getToken";
import { rolesKeys } from "@/pageData/roles";
import { getCategoryAPI } from "@/pages/api/category";
import { getUserDashboardDataAPI } from "@/pages/api/user-dashboard";
import routes from "@/routes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect, useState, createContext } from "react";

type MainContextType = {
  isMobile: boolean;
  masterCategories: categoryDataType[];
  selectedSubCategory: {
    value: subCategoryDataType[];
    set: React.Dispatch<React.SetStateAction<subCategoryDataType[]>>;
    add: (category: subCategoryDataType) => void;
    remove: (index: number) => void;
  };
  selectedSubCategoryIds: {
    value: subCategoryDataType[];
    set: React.Dispatch<React.SetStateAction<subCategoryDataType[]>>;
    add: (category: subCategoryDataType) => void;
    remove: (index: number) => void;
  };
  customCategory: {
    value: categoryDataType[];
    set: React.Dispatch<React.SetStateAction<categoryDataType[]>>;
    add: (category: categoryDataType) => void;
    remove: (index: number) => void;
  };
  userData: {
    value: userResponseDataType | undefined;
    set: React.Dispatch<React.SetStateAction<userResponseDataType | undefined>>;
  };
  organizationData: {
    value: organizationsDataType | undefined;
    set: React.Dispatch<
      React.SetStateAction<organizationsDataType | undefined>
    >;
  };
  userDashboard: {
    data?: dashboardApiDataType;
    get: () => void;
    set: React.Dispatch<React.SetStateAction<dashboardApiDataType | undefined>>;
  };
  taskHoveredAt: {
    value: string;
    set: React.Dispatch<React.SetStateAction<string>>;
  };
};

const MainContext = createContext<MainContextType | undefined>(undefined);

type ChildrenProps = {
  children: React.ReactNode;
};

const MainProvider: React.FC<ChildrenProps> = ({ children }) => {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [loggedIn, setLoggedIn] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [isMobile, setIsMobile] = useState<boolean>(false);
  const [masterCategories, setMasterCategories] = useState<categoryDataType[]>(
    []
  );
  const [selectedCategory, setSelectedCategory] = useState<
    subCategoryDataType[]
  >([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<
    subCategoryDataType[]
  >([]);
  const [customCategory, setCustomCategory] = useState<categoryDataType[]>([]);
  const [userData, setUserData] = useState<userResponseDataType>();
  const [organizationData, setOrganizationData] =
    useState<organizationsDataType>();

  const [taskHoveredAt, setTaskHoveredAt] = useState<string>("");

  const [userDashboardData, setUserDashboardData] =
    useState<dashboardApiDataType>();

  const checkLoggedIn = () => {
    const token = getToken();
    if (token) {
      setLoggedIn(true);
    } else {
      setLoggedIn(false);
    }
    setLoading(false);
  };

  useEffect(() => {
    checkLoggedIn();
  }, []);

  useEffect(() => {
    if (!loading) {
      const pathIsAuth =
        pathname === routes.auth.admin.login ||
        pathname === routes.auth.users.login;

      if (loggedIn) {
        if (pathIsAuth) {
          router.push(routes.loading);
        } else if (pathname !== routes.loading && !pathIsAuth) {
          const searchString = searchParams.toString();
          const fullPath = searchString
            ? `${pathname}?${searchString}`
            : pathname;
          router.push(`${routes.loading}?from=${encodeURIComponent(fullPath)}`);
        }
      } else {
        const pathStartsWithAdminAuth = pathname.startsWith(
          routes.auth.admin.login
        );
        const pathStartsWithAuth = pathname.startsWith(routes.auth.users.login);

        if (pathStartsWithAdminAuth && !pathIsAuth) {
          router.push(routes.auth.admin.login);
        } else if (pathStartsWithAuth && !pathIsAuth) {
          router.push(routes.auth.users.login);
        }
      }
    }
  }, [loading]);

  useEffect(() => {
    if (
      pathname.startsWith(routes.admin.main) &&
      userData &&
      userData.role !== rolesKeys.superAdmin
    ) {
      router.push(routes.loading);
    }
  }, [pathname, userData]);

  useEffect(() => {
    getCategoryAPI(
      (categories) => {
        setMasterCategories(categories);
      },
      (err) => {
        console.log(err);
      }
    );
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };

    handleResize();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const addCategory = (category: subCategoryDataType) => {
    setSelectedCategory((prev) => (prev ? [...prev, category] : [category]));
  };

  const removeCategory = (index: number) => {
    setSelectedCategory((prev) =>
      prev ? prev.filter((_, i) => i !== index) : prev
    );
  };

  const addCategoryId = (category: subCategoryDataType) => {
    setSelectedCategoryId((prev) => (prev ? [...prev, category] : [category]));
  };

  const removeCategoryId = (index: number) => {
    setSelectedCategoryId((prev) =>
      prev ? prev.filter((_, i) => i !== index) : prev
    );
  };

  const addCustomCategory = (category: categoryDataType) => {
    setCustomCategory((prev) => (prev ? [...prev, category] : [category]));
  };

  const removeCustomCategory = (index: number) => {
    setCustomCategory((prev) =>
      prev ? prev.filter((_, i) => i !== index) : prev
    );
  };

  const getUserDashboard = () => {
    getUserDashboardDataAPI(
      (user) => {
        setUserDashboardData(user);
      },
      (err) => {
        console.log(err);
      }
    );
  };

  const contextValue: MainContextType = {
    isMobile,
    masterCategories,
    customCategory: {
      value: customCategory,
      set: setCustomCategory,
      add: addCustomCategory,
      remove: removeCustomCategory,
    },
    selectedSubCategory: {
      value: selectedCategory,
      set: setSelectedCategory,
      add: addCategory,
      remove: removeCategory,
    },
    selectedSubCategoryIds: {
      value: selectedCategoryId,
      set: setSelectedCategoryId,
      add: addCategoryId,
      remove: removeCategoryId,
    },
    userData: {
      value: userData,
      set: setUserData,
    },
    organizationData: {
      value: organizationData,
      set: setOrganizationData,
    },
    userDashboard: {
      data: userDashboardData,
      get: getUserDashboard,
      set: setUserDashboardData,
    },
    taskHoveredAt: {
      value: taskHoveredAt,
      set: setTaskHoveredAt,
    },
  };

  return (
    <MainContext.Provider value={contextValue}>{children}</MainContext.Provider>
  );
};

export { MainContext, MainProvider };
