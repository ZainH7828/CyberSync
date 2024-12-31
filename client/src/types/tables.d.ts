import { SetStateAction } from "react";

declare global {

  type categoryTableType = {
    masterId: string;
    master: string;
    code: string;
    subCatId: string;
    subCat: string;
    subCatCode: string;
    prevScore?: number | string;
    targetScore: number;
    score: number;
    note: string;
  };
  interface simpleTablePropsType {
    headings: string[];
    keys: string[];
    data: any[];
    showSno?: boolean;
    showActions?: boolean;
    actionComponents?: any[];
    dataPerPage?: number;
    categoryData?: categoryTableType[];
    overflowVisible?: boolean;
    setScoreState?: React.Dispatch<SetStateAction<categoryTableType[]>>;
    noteEditable?: boolean;
  }
  interface tasksType {
    name: string;
    owner: string;
    dueDate: string;
    status: string;
    progress: number;
    doc: string;
  }

  interface taskTableDataType {
    title: string;
    color: string;
    tasks: tasksType[];
  }

  interface taskTablePropsType extends taskTableDataType {
    isEditable?: boolean;
    toggleTasksBar: () => void;
  }

  interface processTdPropType {
    color: string;
    progress: number;
  }

  interface StatusTdType {
    status: string;
    setStatus: React.Dispatch<React.SetStateAction<string>>;
  }

  interface DateTdType {
    date: Date;
    setDate: React.Dispatch<React.SetStateAction<Data>>;
  }

  interface TaskTdType {
    code?: string;
    isEditable?: boolean;
    subCategoryId: string;
    rowCount: number;
    color: string;
    checked: boolean;
    task: dashboardApiTaskDataType;
    onCheck: () => void;
    toggleTasksBar: (taskId: string, isSubTask?: boolean) => void;
    isCategoryPage?: boolean;
  }

  interface SubTaskTrProps {
    subTask: subTaskApiResponseType;
    color: string;
    taskId: string;
    subCategoryId: string;
    toggleTasksBar: (taskId: string, isSubTask?: boolean) => void;
    isEditable?: boolean;
  }

  interface AssigneesTdType {
    assignees: {
      _id: string;
      name: string;
    }[];
    subCategoryId: string;
    taskId: string;
    subTaskId?: string;
  }
}

export default global;
