import React from 'react';

const Legend = ({ arms, showLegend, legendPosition, flowPanelPosition, BRANCH_COLORS }) => {
    if (!showLegend) return null;

    return (
        <div
            className={`flex flex-col gap-2 p-3 bg-black/40 backdrop-blur-md border border-white/5 rounded-xl shadow-2xl pointer-events-auto transition-all`}
            style={{
                order: legendPosition === flowPanelPosition ? 2 : 0,
                position: legendPosition === flowPanelPosition ? 'relative' : 'absolute',
                top: legendPosition === flowPanelPosition ? 'auto' : (legendPosition.startsWith('top') ? '0' : 'auto'),
                bottom: legendPosition === flowPanelPosition ? 'auto' : (legendPosition.startsWith('bottom') ? '0' : 'auto'),
                left: legendPosition === flowPanelPosition ? 'auto' : (legendPosition.endsWith('left') ? '0' : 'auto'),
                right: legendPosition === flowPanelPosition ? 'auto' : (legendPosition.endsWith('right') ? '0' : 'auto'),
            }}
        >
            <h4 className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1 text-white">Destinations</h4>
            {arms.map(arm => (
                <div key={arm.id} className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded shadow-[0_0_8px_currentColor]" style={{
                        color: BRANCH_COLORS[arm.baseAngle] || '#94a3b8',
                        backgroundColor: 'currentColor'
                    }} />
                    <span className="text-[9px] font-bold text-white uppercase tracking-wider whitespace-nowrap">To {arm.label}</span>
                </div>
            ))}
        </div>
    );
};

export default Legend;
