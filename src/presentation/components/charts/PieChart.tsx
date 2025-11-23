import React from 'react';
import {
  AccumulationChartComponent,
  AccumulationSeriesCollectionDirective,
  AccumulationSeriesDirective,
  Inject,
  AccumulationLegend,
  PieSeries,
  AccumulationTooltip,
  AccumulationDataLabel,
} from '@syncfusion/ej2-react-charts';

interface PieChartProps {
  data: Array<{ x: string; y: number; text?: string }>;
  title?: string;
  height?: string;
}

export const PieChart: React.FC<PieChartProps> = ({
  data,
  title,
  height = '350px',
}) => {
  return (
    <AccumulationChartComponent
      id="pie-chart"
      title={title}
      height={height}
      tooltip={{ enable: true }}
      legendSettings={{ visible: true }}
    >
      <Inject
        services={[
          AccumulationLegend,
          PieSeries,
          AccumulationTooltip,
          AccumulationDataLabel,
        ]}
      />
      <AccumulationSeriesCollectionDirective>
        <AccumulationSeriesDirective
          dataSource={data}
          xName="x"
          yName="y"
          type="Pie"
          dataLabel={{
            visible: true,
            position: 'Outside',
            name: 'text',
          }}
        />
      </AccumulationSeriesCollectionDirective>
    </AccumulationChartComponent>
  );
};

