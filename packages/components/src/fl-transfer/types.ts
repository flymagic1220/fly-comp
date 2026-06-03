type TjTransferTypeEnum = 'list' | 'table';
interface TjTransferProps {
  /**
   * 数据展现形式
   * @default 'list'
   * @optional
   */
  type?: TjTransferTypeEnum;
}
export type { TjTransferProps };
