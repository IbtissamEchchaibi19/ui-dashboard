// src/presentation/components/common/DataTable.tsx
import React from 'react';
import {
  GridComponent,
  ColumnsDirective,
  ColumnDirective,
  Page,
  Sort,
  Filter,
  Inject,
  Toolbar,
  Search,
  Resize,
  ColumnChooser,
} from '@syncfusion/ej2-react-grids';

export interface TableColumn {
  field: string;
  headerText: string;
  width?: string;
  textAlign?: 'Left' | 'Center' | 'Right';
  format?: string;
  type?: 'string' | 'number' | 'boolean' | 'date' | 'datetime';
  template?: (props: any) => React.ReactNode;
  allowSorting?: boolean;
  allowFiltering?: boolean;
}

interface DataTableProps {
  data: any[];
  columns: TableColumn[];
  pageSize?: number;
  allowPaging?: boolean;
  allowSorting?: boolean;
  allowFiltering?: boolean;
  allowResizing?: boolean;
  showToolbar?: boolean;
  height?: string;
  onRowSelected?: (row: any) => void;
}

export const DataTable: React.FC<DataTableProps> = ({
  data,
  columns,
  pageSize = 10,
  allowPaging = true,
  allowSorting = true,
  allowFiltering = false,
  allowResizing = true,
  showToolbar = true,
  height = 'auto',
  onRowSelected,
}) => {
  const pageSettings = { pageSize, pageSizes: [10, 25, 50, 100] };
  const toolbarOptions = showToolbar ? ['Search', 'ColumnChooser'] : undefined;

  const handleRowSelected = (args: any) => {
    if (onRowSelected) {
      onRowSelected(args.data);
    }
  };

  return (
    <GridComponent
      dataSource={data}
      allowPaging={allowPaging}
      allowSorting={allowSorting}
      allowFiltering={allowFiltering}
      allowResizing={allowResizing}
      pageSettings={pageSettings}
      toolbar={toolbarOptions}
      height={height}
      rowSelected={handleRowSelected}
    >
      <ColumnsDirective>
        {columns.map((col) => (
          <ColumnDirective
            key={col.field}
            field={col.field}
            headerText={col.headerText}
            width={col.width}
            textAlign={col.textAlign}
            format={col.format}
            type={col.type}
            template={col.template}
            allowSorting={col.allowSorting}
            allowFiltering={col.allowFiltering}
          />
        ))}
      </ColumnsDirective>
      <Inject
        services={[Page, Sort, Filter, Toolbar, Search, Resize, ColumnChooser]}
      />
    </GridComponent>
  );
};