// src/presentation/components/charts/LineChart.tsx
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
  LineSeries,
  DateTime,
} from '@syncfusion/ej2-react-charts';

interface LineChartProps {
  data: Array<{ x: Date | string; y: number; label?: string }>;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: string;
  seriesName?: string;
}

export const LineChart: React.FC<LineChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  height = '350px',
  seriesName = 'Data',
}) => {
  return (
    <ChartComponent
      id="line-chart"
      primaryXAxis={{
        valueType: 'DateTime',
        title: xAxisLabel,
        labelFormat: 'MMM dd',
      }}
      primaryYAxis={{
        title: yAxisLabel,
        labelFormat: '{value}',
      }}
      title={title}
      height={height}
      tooltip={{ enable: true }}
    >
      <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category, DateTime]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={data}
          xName="x"
          yName="y"
          name={seriesName}
          type="Line"
          marker={{ visible: true, width: 10, height: 10 }}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};
