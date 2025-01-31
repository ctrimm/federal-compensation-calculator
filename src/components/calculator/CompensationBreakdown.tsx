import React from 'react';
import { CompensationBreakdownProps } from './types';

export const CompensationBreakdown: React.FC<CompensationBreakdownProps> = ({
  compDetails,
  showTooltip,
  setShowTooltip,
  tooltips
}) => {
  type TooltipKey = keyof typeof tooltips;

  return (
    <table className="w-full mt-4">
      <tbody>
        {[
          { label: 'Base Pay' as TooltipKey, value: compDetails.basePay },
          { label: 'Locality Pay' as TooltipKey, value: compDetails.localityPay },
          { label: 'Leave Value' as TooltipKey, value: compDetails.benefits.leave.annual + compDetails.benefits.leave.sick },
          { label: 'FEHB' as TooltipKey, value: compDetails.benefits.fehb },
          { label: 'TSP Match' as TooltipKey, value: compDetails.benefits.fers.tsp_match },
          { label: 'FERS Basic' as TooltipKey, value: compDetails.benefits.fers.basic },
          { label: 'FEGLI' as TooltipKey, value: compDetails.benefits.fegli },
          ...(compDetails.benefits.leave.ppl ? [
            { label: 'PPL Value' as TooltipKey, value: compDetails.benefits.leave.ppl.total }
          ] : [])
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
  );
};
