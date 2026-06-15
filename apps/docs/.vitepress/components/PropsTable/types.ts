export type PropsTableData = Array<{
  prop: string | { text: string; version: string };
  desc: string;
  type: { text: string; tip?: string }[];
  default?: string;
}>;
