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
  AreaSeries,
  DateTime,
} from '@syncfusion/ej2-react-charts';

interface AreaChartProps {
  data: Array<{ x: Date | string; y: number }>;
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  height?: string;
  seriesName?: string;
}

export const AreaChart: React.FC<AreaChartProps> = ({
  data,
  title,
  xAxisLabel,
  yAxisLabel,
  height = '350px',
  seriesName = 'Data',
}) => {
  return (
    <ChartComponent
      id="area-chart"
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
      <Inject services={[AreaSeries, Legend, Tooltip, DataLabel, Category, DateTime]} />
      <SeriesCollectionDirective>
        <SeriesDirective
          dataSource={data}
          xName="x"
          yName="y"
          name={seriesName}
          type="Area"
          opacity={0.5}
        />
      </SeriesCollectionDirective>
    </ChartComponent>
  );
};