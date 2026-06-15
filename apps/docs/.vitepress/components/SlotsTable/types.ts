type SlotsTableData = Array<{
  name: string | { text: string; version: string };
  desc: string;
  childTag?: string;
}>;

export type { SlotsTableData };
