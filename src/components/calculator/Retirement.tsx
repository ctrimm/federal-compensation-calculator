import React from 'react';
import { RetirementProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const Retirement: React.FC<RetirementProps> = ({ compDetails }) => {
  console.log('Retirement data:', {
    count: compDetails?.projections?.length,
    first: compDetails?.projections?.[0],
    last: compDetails?.projections?.[compDetails?.projections?.length - 1],
    tspSample: compDetails?.projections?.[0]?.cumulativeTsp,
    pensionSample: compDetails?.projections?.[0]?.cumulativePension
  });

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Retirement Benefits Growth</CardTitle>
          <CardDescription>Projected value of retirement benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {compDetails?.projections && (
              <AreaChart
                width={800}
                height={400}
                data={compDetails.projections}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year" />
                <YAxis tickFormatter={(value) => `$${(value/1000).toFixed(0)}k`} />
                <Tooltip 
                  formatter={(value) => `$${Number(value).toLocaleString()}`}
                  labelFormatter={(label) => `Year: ${label}`}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="cumulativeTsp" 
                  name="TSP Balance" 
                  stackId="1"
                  stroke="#8884d8" 
                  fill="#8884d8"
                  isAnimationActive={false}
                />
                <Area 
                  type="monotone" 
                  dataKey="cumulativePension" 
                  name="Annual Pension" 
                  stackId="2"
                  stroke="#82ca9d" 
                  fill="#82ca9d"
                  isAnimationActive={false}
                />
              </AreaChart>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
