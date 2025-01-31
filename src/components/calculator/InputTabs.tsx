import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { Label } from "../ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { LocalityArea, PplEvent } from '../../types';
import { BasicInputProps, FineTuningProps } from './types';

interface InputTabsProps extends BasicInputProps, FineTuningProps {
  localityAreas: LocalityArea[];
  currentYear: number;
  mra: number;
  eligibleMRA10: boolean;
  eligibleImmediate: boolean;
  eligibleDeferred: boolean;
  formatRemaining: (value: number) => number;
  yearsOfService: number;
}

export const InputTabs: React.FC<InputTabsProps> = ({
  gsLevel,
  setGsLevel,
  step,
  setStep,
  locality,
  setLocality,
  serviceYears,
  setServiceYears,
  serviceMonths,
  setServiceMonths,
  currentAge,
  setCurrentAge,
  tspContribution,
  setTspContribution,
  tspGrowthRate,
  setTspGrowthRate,
  retirementAge,
  setRetirementAge,
  initialTspBalance,
  setInitialTspBalance,
  pplEvents,
  setPplEvents,
  useBlanketRaise,
  setUseBlanketRaise,
  blanketRaiseValue,
  setBlanketRaiseValue,
  futureRaises,
  setFutureRaises,
  futureRaiseYears,
  setFutureRaiseYears,
  localityAreas,
  currentYear,
  mra,
  eligibleMRA10,
  eligibleImmediate,
  eligibleDeferred,
  formatRemaining,
  yearsOfService,
  AVERAGE_HISTORICAL_RAISE
}) => {
  const addPplEvent = () => {
    const newEvent: PplEvent = {
      month: 1,
      year: currentYear
    };
    setPplEvents([...pplEvents, newEvent]);
  };

  const updatePplEvent = (index: number, field: keyof PplEvent, value: number) => {
    const updatedEvents = [...pplEvents];
    updatedEvents[index] = {
      ...updatedEvents[index],
      [field]: value
    };
    setPplEvents(updatedEvents);
  };

  const removePplEvent = (index: number) => {
    setPplEvents(pplEvents.filter((_, i) => i !== index));
  };

  return (
    <Tabs defaultValue="basic">
      <TabsList>
        <TabsTrigger value="basic">Basic Details</TabsTrigger>
        <TabsTrigger value="fine-tune">Fine Tuning</TabsTrigger>
      </TabsList>

      <TabsContent value="basic">
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
            <Label htmlFor="service">Length of Service</Label>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="years">Years</Label>
                <input
                  type="number"
                  min="0"
                  max="30"
                  value={serviceYears}
                  onChange={(e) => setServiceYears(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
              <div>
                <Label htmlFor="months">Months</Label>
                <input
                  type="number"
                  min="0"
                  max="11"
                  value={serviceMonths}
                  onChange={(e) => setServiceMonths(Number(e.target.value))}
                  className="w-full p-2 border rounded"
                />
              </div>
            </div>
          </div>

          <div>
            <Label htmlFor="currentAge">Current Age</Label>
            <input
              type="number"
              min="18"
              max="70"
              value={currentAge}
              onChange={(e) => setCurrentAge(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">
              Your Minimum Retirement Age (MRA): {mra}
            </p>
          </div>

                  <div className="space-y-4">
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

                    <div>
                      <Label htmlFor="initialTspBalance">Current TSP Balance ($)</Label>
                      <input
                        type="number"
                        min="0"
                        step="1000"
                        value={initialTspBalance}
                        onChange={(e) => setInitialTspBalance(Number(e.target.value))}
                        className="w-full p-2 border rounded"
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Your existing TSP balance for more accurate retirement projections
                      </p>
                    </div>
                  </div>

          <div>
            <Label htmlFor="tspGrowth">TSP Growth Rate (%)</Label>
            <input
              type="number"
              min="0"
              max="15"
              step="0.1"
              value={tspGrowthRate}
              onChange={(e) => setTspGrowthRate(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <p className="text-sm text-gray-500 mt-1">
              Expected annual return on TSP investments
            </p>
          </div>

          <div>
            <Label htmlFor="retirement">Retirement Age</Label>
            <input
              type="number"
              min={mra}
              max="75"
              value={retirementAge}
              onChange={(e) => setRetirementAge(Number(e.target.value))}
              className="w-full p-2 border rounded"
            />
            <div className="text-sm text-gray-500 mt-1 space-y-1">
              <p>Retirement Eligibility:</p>
              <ul className="list-disc pl-5">
                <li className={eligibleMRA10 ? "text-green-600" : ""}>
                  MRA+10: {eligibleMRA10 ? "Eligible" : `Need ${formatRemaining(Math.max(0, mra - currentAge))} more years and ${formatRemaining(Math.max(0, 10 - yearsOfService))} years of service`}
                </li>
                <li className={eligibleImmediate ? "text-green-600" : ""}>
                  Immediate: {eligibleImmediate ? "Eligible" : `Need ${formatRemaining(Math.max(0, mra - currentAge))} more years and ${formatRemaining(Math.max(0, 30 - yearsOfService))} years of service`}
                </li>
                <li className={eligibleDeferred ? "text-green-600" : ""}>
                  Deferred: {eligibleDeferred ? "Eligible" : `Need ${formatRemaining(Math.max(0, 5 - yearsOfService))} years of service`}
                </li>
              </ul>
            </div>
          </div>
        </div>
      </TabsContent>

      <TabsContent value="fine-tune">
        <div className="space-y-4">
          <div>
            <Label>Paid Parental Leave Events</Label>
            <div className="space-y-4">
              {pplEvents.map((event, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="flex-1">
                    <Label>Month</Label>
                    <input
                      type="number"
                      min="1"
                      max="12"
                      value={event.month}
                      onChange={(e) => updatePplEvent(index, 'month', Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <div className="flex-1">
                    <Label>Year</Label>
                    <input
                      type="number"
                      min={currentYear}
                      max={currentYear + 10}
                      value={event.year}
                      onChange={(e) => updatePplEvent(index, 'year', Number(e.target.value))}
                      className="w-full p-2 border rounded"
                    />
                  </div>
                  <button
                    onClick={() => removePplEvent(index)}
                    className="mt-6 p-2 bg-red-500 text-white rounded hover:bg-red-600"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                onClick={addPplEvent}
                className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add PPL Event
              </button>
            </div>
          </div>

          <div>
            <Label htmlFor="raises">Future Pay Raises</Label>
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={useBlanketRaise}
                  onChange={(e) => setUseBlanketRaise(e.target.checked)}
                  className="w-4 h-4"
                />
                <Label>Use same raise percentage for all years</Label>
              </div>

              {useBlanketRaise ? (
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="0"
                    max="10"
                    step="0.1"
                    value={blanketRaiseValue}
                    onChange={(e) => setBlanketRaiseValue(Number(e.target.value))}
                    className="w-full p-2 border rounded"
                  />
                  <span className="w-8">%</span>
                </div>
              ) : (
                <>
                  <div className="flex items-center gap-2">
                    <Label>Number of years to project:</Label>
                    <input
                      type="number"
                      min="1"
                      max={retirementAge - currentAge}
                      value={futureRaiseYears}
                      onChange={(e) => setFutureRaiseYears(Number(e.target.value))}
                      className="w-24 p-2 border rounded"
                    />
                  </div>
                  <div className="space-y-2">
                    {Array.from({ length: futureRaiseYears }, (_, i) => currentYear + i + 1).map((year, index) => (
                      <div key={year} className="flex items-center gap-2">
                        <span className="w-12">{year}</span>
                        <input
                          type="number"
                          min="0"
                          max="10"
                          step="0.1"
                          value={futureRaises[index] ?? AVERAGE_HISTORICAL_RAISE}
                          onChange={(e) => {
                            console.log('Setting future raise for year', year, 'to', e.target.value);
                            const newRaises = [...futureRaises];
                            newRaises[index] = Number(e.target.value);
                            setFutureRaises(newRaises);
                          }}
                          className="w-full p-2 border rounded"
                        />
                        <span className="w-8">%</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
              <p className="text-sm text-gray-500">
                Historical average: {AVERAGE_HISTORICAL_RAISE}%
              </p>
            </div>
          </div>
        </div>
      </TabsContent>
    </Tabs>
  );
};
