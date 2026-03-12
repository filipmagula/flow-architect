import React from 'react';
import { CheckCircle2, AlertTriangle } from 'lucide-react';

const FlowPanel = ({
    showFlowPanel,
    flowPanelPosition,
    legendPosition,
    delta,
    getStatusColor,
    totalIngress,
    totalEgress
}) => {
    if (!showFlowPanel) return null;

    return (
        <div
            className={`p-4 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.5)] pointer-events-auto transition-all w-64`}
            style={{
                order: legendPosition === flowPanelPosition ? 1 : 0,
                position: legendPosition === flowPanelPosition ? 'relative' : 'absolute',
                top: legendPosition === flowPanelPosition ? 'auto' : (flowPanelPosition.startsWith('top') ? '0' : 'auto'),
                bottom: legendPosition === flowPanelPosition ? 'auto' : (flowPanelPosition.startsWith('bottom') ? '0' : 'auto'),
                left: legendPosition === flowPanelPosition ? 'auto' : (flowPanelPosition.endsWith('left') ? '0' : 'auto'),
                right: legendPosition === flowPanelPosition ? 'auto' : (flowPanelPosition.endsWith('right') ? '0' : 'auto'),
            }}
        >
            <div className="flex justify-between items-start mb-4">
                <div>
                    <h3 className="text-[8px] font-black text-neutral-500 uppercase tracking-widest text-white">Conservation of Flow</h3>
                    <div className={`text-3xl font-mono font-bold mt-0.5 tracking-tighter ${getStatusColor()}`}>
                        {delta > 0 ? `+${delta}` : delta}
                    </div>
                </div>
                <div className={`${getStatusColor()}`}>
                    {Math.abs(delta) === 0 ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
                </div>
            </div>
            <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-[7px] font-black text-neutral-500 uppercase block mb-1 text-white">Inbound</span>
                        <div className="text-sm font-mono text-emerald-400 font-bold">{totalIngress}</div>
                    </div>
                    <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                        <span className="text-[7px] font-black text-neutral-500 uppercase block mb-1 text-white">Outbound</span>
                        <div className="text-sm font-mono text-amber-400 font-bold">{totalEgress}</div>
                    </div>
                </div>
                <div className="h-1.5 bg-neutral-800 rounded-full overflow-hidden">
                    <div
                        className={`h-full transition-all duration-1000 ease-out ${Math.abs(delta) === 0 ? 'bg-emerald-500' : 'bg-blue-500'}`}
                        style={{ width: `${Math.min(100, (totalEgress / totalIngress) * 100 || 0)}%` }}
                    />
                </div>
            </div>
        </div>
    );
};

export default FlowPanel;
