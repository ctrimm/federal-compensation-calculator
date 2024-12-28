import React, { useState, useEffect } from 'react';
import { calculateTotalCompensation } from '../utils/calculations';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { LocalityArea, CompensationResult } from '../types';
import { Sankey, Rectangle, PieChart, Pie, Cell, Tooltip } from 'recharts';

const CompensationCalculator: React.FC = () => {
  const [gsLevel, setGsLevel] = useState<string>('');
  const [step, setStep] = useState<string>('');
  const [locality, setLocality] = useState<string>('');
  const [totalComp, setTotalComp] = useState<number>(0);
  const [compDetails, setCompDetails] = useState<CompensationResult | null>(null);
  const [tspContribution, setTspContribution] = useState<number>(5);
  const [showTooltip, setShowTooltip] = useState<string | null>(null);

  const tooltips = {
    'Base Pay': "Base salary determined by GS level and step",
    'Locality Pay': "Additional pay based on your geographic location",
    'FEHB': "Federal Employees Health Benefits - Government pays ~72% of premiums",
    'FEGLI': "Federal Employees Group Life Insurance - Basic coverage at low cost",
    'FERS Basic': "Federal Employees Retirement System - Defined benefit pension plan",
    'TSP Match': "Government matches up to 5% of your base pay contribution",
    'Leave Value': "Monetary value of annual & sick leave accrual",
  };

  const localityAreas: LocalityArea[] = [
    { id: 'DC', name: 'Washington-Baltimore-Arlington, DC-MD-VA-WV-PA', rate: 32.49 },
    { id: 'SF', name: 'San Francisco-Oakland-San Jose, CA', rate: 42.74 },
    { id: 'NYC', name: 'New York-Newark, NY-NJ-CT-PA', rate: 35.28 },
  ];

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#8884d8'];

  const handleCalculate = () => {
    if (!gsLevel || !step || !locality) return;
    
    const localityRate = localityAreas.find(l => l.id === locality)?.rate || 0;
    const result = calculateTotalCompensation(
      parseInt(gsLevel), 
      parseInt(step), 
      localityRate,
      tspContribution
    );
    console.log('Calculation Result:', {
      gsLevel,
      step,
      localityRate,
      tspContribution,
      result
    });
    setTotalComp(result.total);
    setCompDetails(result);
  };

  const getSankeyData = () => {
    if (!compDetails) return { nodes: [], links: [] };

    return {
      nodes: [
        { name: "Base Pay" },
        { name: "Locality Pay" },
        { name: "FEHB" },
        { name: "FEGLI" },
        { name: "FERS Basic" },
        { name: "TSP Match" },
        { name: "Leave Value" },
        { name: "Total Compensation" }
      ],
      links: [
        { source: 0, target: 7, value: compDetails.basePay },
        { source: 1, target: 7, value: compDetails.localityPay },
        { source: 2, target: 7, value: compDetails.benefits.fehb },
        { source: 3, target: 7, value: compDetails.benefits.fegli },
        { source: 4, target: 7, value: compDetails.benefits.fers.basic },
        { source: 5, target: 7, value: compDetails.benefits.fers.tsp_match },
        { source: 6, target: 7, value: compDetails.benefits.leave.annual + compDetails.benefits.leave.sick }
      ]
    };
  };

  const getPieData = () => {
    if (!compDetails) return [];

    return [
      { name: 'Base Pay', value: compDetails.basePay },
      { name: 'Locality Pay', value: compDetails.localityPay },
      { name: 'FEHB', value: compDetails.benefits.fehb },
      { name: 'FEGLI', value: compDetails.benefits.fegli },
      { name: 'FERS Basic', value: compDetails.benefits.fers.basic },
      { name: 'TSP Match', value: compDetails.benefits.fers.tsp_match },
      { name: 'Leave Value', value: compDetails.benefits.leave.annual + compDetails.benefits.leave.sick }
    ];
  };

  useEffect(() => {
    handleCalculate();
  }, [gsLevel, step, locality, tspContribution]);

  return (
    <div className="container mx-auto p-4">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">Federal Employee Total Compensation Calculator</CardTitle>
          <CardDescription>Calculate your total compensation package including benefits and locality pay</CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Input Your Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <Label htmlFor="gs-level">GS Level</Label>
                <Select value={gsLevel} onValueChange={setGsLevel}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select GS Level" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 15}, (_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString()}>
                        GS-{i+1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="step">Step</Label>
                <Select value={step} onValueChange={setStep}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Step" />
                  </SelectTrigger>
                  <SelectContent>
                    {Array.from({length: 10}, (_, i) => (
                      <SelectItem key={i+1} value={(i+1).toString()}>
                        Step {i+1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="locality">Locality Pay Area</Label>
                <Select value={locality} onValueChange={setLocality}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select Locality" />
                  </SelectTrigger>
                  <SelectContent>
                    {localityAreas.map(area => (
                      <SelectItem key={area.id} value={area.id}>
                        {area.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="tsp">TSP Contribution (%)</Label>
                <div className="flex items-center gap-2">
                  <input 
                    type="range" 
                    min="0" 
                    max="25" 
                    value={tspContribution} 
                    onChange={(e) => setTspContribution(Number(e.target.value))}
                    className="w-full"
                  />
                  <span className="w-12 text-right">{tspContribution}%</span>
                </div>
                <p className="text-sm text-gray-500 mt-1">
                  Government matches up to 5% of your contribution
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>"Make Me Quit" Number</CardTitle>
            <CardDescription>Your total compensation package value</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-6xl font-bold text-center p-8">
              ${totalComp.toLocaleString()}
            </div>
            {compDetails && (
              <table className="w-full mt-4">
                <tbody>
                  {[
                    { label: 'Base Pay', value: compDetails.basePay },
                    { label: 'Locality Pay', value: compDetails.localityPay },
                    { label: 'Leave Value', value: compDetails.benefits.leave.annual + compDetails.benefits.leave.sick },
                    { label: 'FEHB', value: compDetails.benefits.fehb },
                    { label: 'TSP Match', value: compDetails.benefits.fers.tsp_match },
                    { label: 'FERS Basic', value: compDetails.benefits.fers.basic },
                    { label: 'FEGLI', value: compDetails.benefits.fegli },
                  ].sort((a, b) => b.value - a.value).map((item, index) => (
                    <tr key={item.label} className={index % 2 === 0 ? 'bg-gray-50' : ''}>
                      <td 
                        className="p-2 border cursor-help relative"
                        onMouseEnter={() => setShowTooltip(item.label)}
                        onMouseLeave={() => setShowTooltip(null)}
                      >
                        {item.label}
                        {showTooltip === item.label && (
                          <div className="absolute left-0 top-full mt-1 bg-black text-white p-2 rounded text-sm z-10 w-64">
                            {tooltips[item.label]}
                          </div>
                        )}
                      </td>
                      <td className="p-2 border text-right">${item.value.toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="breakdown" className="mt-6">
        <TabsList>
          <TabsTrigger value="breakdown">Compensation Breakdown</TabsTrigger>
          <TabsTrigger value="pie">Pie Chart</TabsTrigger>
          <TabsTrigger value="longterm">Long-term Benefits</TabsTrigger>
        </TabsList>
        
        <TabsContent value="breakdown">
          <Card>
            <CardHeader>
              <CardTitle>Total Compensation Breakdown</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-96">
                {compDetails && (
                  <Sankey
                    width={800}
                    height={400}
                    data={getSankeyData()}
                    node={<Rectangle fill="#0088FE" />}
                    nodePadding={50}
                    margin={{ top: 10, right: 10, bottom: 10, left: 10 }}
                  />
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pie">
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
                    >
                      {getPieData().map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="longterm">
          <Card>
            <CardHeader>
              <CardTitle>Long-term Benefits Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Annual Leave Accrual</h3>
                  <p>0-3 years: 4 hours per pay period (13 days/year)</p>
                  <p>3-15 years: 6 hours per pay period (20 days/year)</p>
                  <p>15+ years: 8 hours per pay period (26 days/year)</p>
                </div>
                
                <div>
                  <h3 className="font-semibold mb-2">FERS Retirement Benefits</h3>
                  <p>Basic Benefit Plan: 1% of high-3 average salary × years of service</p>
                  <p>TSP: Up to 5% government matching</p>
                  <p>Social Security Benefits</p>
                </div>

                <div>
                  <h3 className="font-semibold mb-2">Other Benefits</h3>
                  <p>Sick Leave: 4 hours per pay period (13 days/year)</p>
                  <p>Health Insurance: FEHB with government contribution</p>
                  <p>Life Insurance: FEGLI options</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default CompensationCalculator;
