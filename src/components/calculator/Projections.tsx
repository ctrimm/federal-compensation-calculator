import React from 'react';
import { ProjectionsProps } from './types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../ui/card";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

export const Projections: React.FC<ProjectionsProps> = ({ compDetails }) => {
  console.log('Projections data:', {
    count: compDetails?.projections?.length,
    first: compDetails?.projections?.[0],
    last: compDetails?.projections?.[compDetails?.projections?.length - 1]
  });

  return (
    <div className="grid grid-cols-1 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Compensation Growth Over Time</CardTitle>
          <CardDescription>Projected total compensation including benefits</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            {compDetails?.projections && (
              <LineChart
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
                <Line 
                  type="monotone" 
                  dataKey="basePay" 
                  name="Base Pay" 
                  stroke="#8884d8"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="totalCompensation" 
                  name="Total Compensation" 
                  stroke="#82ca9d"
                  isAnimationActive={false}
                />
                <Line 
                  type="monotone" 
                  dataKey="pplValue" 
                  name="PPL Value" 
                  stroke="#ffc658"
                  isAnimationActive={false}
                />
              </LineChart>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
