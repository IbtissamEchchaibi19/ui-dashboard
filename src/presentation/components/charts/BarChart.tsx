import React from 'react';
import {
  ChartComponent,
  SeriesCollectionDirective,
  SeriesDirective,
  Inject,
  Legend,
  Category,
  Tooltip,
  DataLabel,
  ColumnSeries,
} from '@syncfusion/ej2-react-charts';

interface BarChartProps {
  data: Array<{ x: string; y: number }>;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: string;
  seriesName?: string;
}

export const BarChart: React.FC<BarChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  height = '350px',
  seriesName = 'Data',
}) => {
  return (
    <ChartComponent
      id="bar-chart"
      primaryXAxis={{
        valueType: 'Category',
        title: xAxisLabel,
      }}
      primaryYAxis={{
        title: yAxisLabel,
        labelFormat: '{value}',
      }}
      title={title}
      height={height}
      tooltip={{ enable: true }}
    >
      <Inject services={[ColumnSeries, Legend, Tooltip, DataLabel, Category]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={data}
          xName="x"
          yName="y"
          name={seriesName}
          type="Column"
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};

