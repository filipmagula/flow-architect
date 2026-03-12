import React from 'react';
import { Layers, Eye, Palette, Activity } from 'lucide-react';
import Toggle from '../Common/Toggle';
import Slider from '../Common/Slider';

const SidebarRight = ({
    showDebugSidebar,
    hubMode,
    setHubMode,
    hubOverlap,
    setHubOverlap,
    hubWidthOffset,
    setHubWidthOffset,
    showInternalRibbons,
    setShowInternalRibbons,
    showLegend,
    setShowLegend,
    legendPosition,
    setLegendPosition,
    showFlowPanel,
    setShowFlowPanel,
    flowPanelPosition,
    setFlowPanelPosition,
    useFixedRibbonWidth,
    setUseFixedRibbonWidth,
    ribbonOverlap,
    setRibbonOverlap,
    labelHorizontalOffset,
    setLabelHorizontalOffset,
    canvasBg,
    setCanvasBg
}) => {
    return (
        <aside
            className={`absolute right-0 top-0 h-full z-40 bg-neutral-900 border-l border-white/5 overflow-y-auto shrink-0 custom-scrollbar transition-all duration-300 ease-in-out shadow-2xl ${showDebugSidebar ? 'w-[320px] p-4 opacity-100' : 'w-0 p-0 opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex items-center gap-2 text-neutral-400 mb-6 px-2">
                <Layers size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Debug & Rendering</h2>
            </div>

            <div className="space-y-6">
                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
                    <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Eye size={12} /> Visibility
                    </h3>

                    <div className="space-y-3">
                        <span className="text-xs text-neutral-300">Hub Geometry</span>
                        <div className="grid grid-cols-3 gap-1 bg-black/40 p-1 rounded-lg border border-white/5">
                            {[
                                { id: 0, label: 'NONE' },
                                { id: 2, label: 'DYNAMIC' }
                            ].map((m) => (
                                <button
                                    key={m.id}
                                    onClick={() => setHubMode(m.id)}
                                    className={`py-1.5 text-[8px] font-black tracking-widest rounded transition-all ${hubMode === m.id ? 'bg-blue-600 text-white' : 'text-neutral-500 hover:text-neutral-300'}`}
                                >
                                    {m.label}
                                </button>
                            ))}
                        </div>
                        {hubMode === 2 && (
                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <Slider label="Hub Overlap" value={hubOverlap} min={0} max={150} step={5} onChange={setHubOverlap} />
                                <Slider label="Mouth Width" value={hubWidthOffset} min={0} max={150} step={5} onChange={setHubWidthOffset} unit="px" />
                            </div>
                        )}
                    </div>

                    <Toggle label="Central Ribbons" enabled={showInternalRibbons} onToggle={() => setShowInternalRibbons(!showInternalRibbons)} />
                    <Toggle label="Show Legend" enabled={showLegend} onToggle={() => setShowLegend(!showLegend)} />

                    {showLegend && (
                        <div className="space-y-2 pt-2 border-t border-white/5">
                            <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Legend Position</span>
                            <div className="grid grid-cols-4 gap-1">
                                {[
                                    { id: 'top-left', label: 'TL' },
                                    { id: 'top-right', label: 'TR' },
                                    { id: 'bottom-left', label: 'BL' },
                                    { id: 'bottom-right', label: 'BR' }
                                ].map((pos) => (
                                    <button
                                        key={pos.id}
                                        onClick={() => setLegendPosition(pos.id)}
                                        className={`py-1.5 text-[8px] font-black tracking-widest rounded transition-all border ${legendPosition === pos.id ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/5 text-neutral-500 hover:text-neutral-300'}`}
                                    >
                                        {pos.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="pt-4 border-t border-white/5 space-y-4">
                        <Toggle label="Flow Panel" enabled={showFlowPanel} onToggle={() => setShowFlowPanel(!showFlowPanel)} />
                        {showFlowPanel && (
                            <div className="space-y-2">
                                <span className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest">Position</span>
                                <div className="grid grid-cols-4 gap-1">
                                    {[
                                        { id: 'top-left', label: 'TL' },
                                        { id: 'top-right', label: 'TR' },
                                        { id: 'bottom-left', label: 'BL' },
                                        { id: 'bottom-right', label: 'BR' }
                                    ].map((pos) => (
                                        <button
                                            key={pos.id}
                                            onClick={() => setFlowPanelPosition(pos.id)}
                                            className={`py-1.5 text-[8px] font-black tracking-widest rounded transition-all border ${flowPanelPosition === pos.id ? 'bg-blue-600 border-blue-500 text-white' : 'border-white/5 text-neutral-500 hover:text-neutral-300'}`}
                                        >
                                            {pos.label}
                                        </button>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
                    <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Activity size={12} /> Ribbon Controls
                    </h3>

                    <Toggle label="Fixed Width" subLabel="Lane scale" enabled={useFixedRibbonWidth} onToggle={() => setUseFixedRibbonWidth(!useFixedRibbonWidth)} />
                    <Slider label="Overlap Length" value={ribbonOverlap} min={-30} max={30} step={1} onChange={setRibbonOverlap} />
                    <Slider label="Label Offset" value={labelHorizontalOffset} min={0} max={300} onChange={setLabelHorizontalOffset} />
                </div>

                <div className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
                    <h3 className="text-[9px] font-bold text-neutral-500 uppercase tracking-widest mb-2 flex items-center gap-2">
                        <Palette size={12} /> Background
                    </h3>

                    <div className="grid grid-cols-2 gap-2">
                        {[
                            { id: 'Dark', class: 'bg-[#050505]' },
                            { id: 'Graphite', class: 'bg-[#18181b]' },
                            { id: 'Slate', class: 'bg-[#1e293b]' },
                            { id: 'Gray', class: 'bg-[#334155]' }
                        ].map((theme) => (
                            <button
                                key={theme.id}
                                onClick={() => setCanvasBg(theme.class)}
                                className={`flex flex-col items-center gap-2 p-3 rounded-lg border transition-all ${canvasBg === theme.class ? 'border-blue-500 bg-blue-600/10' : 'border-white/5 hover:border-white/20'
                                    }`}
                            >
                                <div className={`w-8 h-8 rounded shadow-inner ${theme.class} border border-white/10`} />
                                <span className="text-[10px] font-bold text-neutral-400">{theme.id}</span>
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default SidebarRight;
