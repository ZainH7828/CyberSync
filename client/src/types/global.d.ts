declare global {
  interface ChildrenProps {
    children: React.ReactNode;
  }

  interface MetaDataType {
    pageName?: string;
    description?: string;
  }

  type themeColorType =
    | "primary"
    | "primary-light"
    | "primary-outlined"
    | "primary-outlined-thin"
    | "danger"
    | "secondary"
    | "tertiary"
    | "quaternary";

  interface LayoutsType extends ChildrenProps {
    type: "auth" | "dashboard" | "onboarding";
    pageName?: string;
    description?: string;
  }

  interface InputType {
    type?: "text" | "password" | "email" | "number" | "checkbox" | "radio" | "date";
    autoComplete?: string;
    label?: string;
    placeholder?: string;
    name?: string;
    setValue?: React.Dispatch<React.SetStateAction<string>>;
    onChange?: (value: string) => void;
    value?: string;
    className?: string;
    required?: boolean;
    disabled?: boolean;
  }

  interface AuthHeadingType {
    heading: string;
    text?: string;
    isCenter?: boolean;
    className?: string;
  }

  interface linkType {
    title: string;
    icon?: string;
    svg?: () => JSX.Element;
    link: string;
  }

  interface buttonType extends ChildrenProps {
    type?: "button" | "submit" | "reset" | undefined;
    className?: string;
    theme?: themeColorType;
    href?: string | Url;
    onClick?: EventEmitter;
    isFullWitdh?: boolean;
    isLoading?: boolean;
    disabled?: boolean;
  }

  interface DashhboardHeadingType {
    heading?: string;
    para?: string;
    icon?: JSX.Element;
    rightLink?: {
      title: string;
      icon?: IconProp;
      link?: string;
      disabled?: boolean;
      onClick?: EventEmitter;
    };
  }

  interface selectOptionsType {
    label: string;
    value: string;
    description?: string;
    disabled?: boolean;
    hidden?: boolean;
    code?: string;
  }

  interface SelectType {
    title?: string;
    value: string;
    options: selectOptionsType[];
    onSelect: selectOptionsSetStateType;
    className?: string;
    code?: string;
    hideIndicator?: boolean;
    labelCentered?: boolean;
  }

  interface MultiSelectType extends SelectType {
    value: string[];
    options: selectOptionsType[];
    onSelect: (selectedValues: string[]) => void;
  }

  type FilterDataType = {
    name: string;
    email?: string;
    updatedAt: Date;
  };

  interface FilterProps {
    data: FilterDataType[];
    onFilterChange: Dispatch<SetStateAction<organizationsDataType[]>>;
  }

  interface userAccessRightsType {
    category?: {
      add: boolean;
      edit: boolean;
    };
    task?: {
      add: boolean;
      edit: boolean;
    };
    downloadReport?: boolean;
    manageTeam?: boolean;
  }

  interface rolesType {
    title: string;
    value: string;
    rights: userAccessRightsType;
  }

  interface catTaskHoveredAtType {
    category: string;
    task: string;
  }
}

export default global;
