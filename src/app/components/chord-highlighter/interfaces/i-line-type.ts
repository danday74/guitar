import { Line } from '@codemirror/state'
import { TLineType } from '@ttypes/t-line-type'

export interface ILineType {
  line: Line
  lineType: TLineType
}
