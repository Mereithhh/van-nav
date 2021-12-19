export interface ToolDataList {
  type: string;
  list: ToolDataItem[];
}

export interface ToolDataItem {
  title: string;
  url: string;
  des: string;
  logo: string;
  linkType?: "webpage" | "service"
}