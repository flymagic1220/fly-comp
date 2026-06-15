export type ExposesTableData = Array<{
  name: string | { text: string; version: string };
  desc: string;
  type: { text: string; tip?: string }[];
}>;
