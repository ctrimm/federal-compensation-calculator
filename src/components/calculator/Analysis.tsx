import React from 'react';
import { AnalysisProps } from './types';
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { PieChart, Pie, Cell, Tooltip } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#8884d8'];

export const Analysis: React.FC<AnalysisProps> = ({ compDetails }) => {
  const getPieData = () => {
    if (!compDetails) return [];

    const pplValue = compDetails.benefits.leave.ppl?.total || 0;

    return [
      { name: 'Base Pay', value: compDetails.basePay },
      { name: 'Locality Pay', value: compDetails.localityPay },
      { name: 'FEHB', value: compDetails.benefits.fehb },
      { name: 'FEGLI', value: compDetails.benefits.fegli },
      { name: 'FERS Basic', value: compDetails.benefits.fers.basic },
      { name: 'TSP Match', value: compDetails.benefits.fers.tsp_match },
      { name: 'Leave Value', value: compDetails.benefits.leave.annual + compDetails.benefits.leave.sick + pplValue }
    ];
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Compensation Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          {compDetails && (
            <PieChart width={800} height={400}>
              <Pie
                data={getPieData()}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={150}
                fill="#8884d8"
                dataKey="value"
                isAnimationActive={false}
              >
                {getPieData().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => `$${Number(value).toLocaleString()}`} />
            </PieChart>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
