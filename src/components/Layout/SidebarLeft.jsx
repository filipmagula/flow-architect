import React from 'react';
import { Settings, Plus, Minus, MapPin, Share2 } from 'lucide-react';
import Slider from '../Common/Slider';

const SidebarLeft = ({
    showSidebar,
    arms,
    updateArm,
    addLane,
    removeLane,
    updateLane,
    toggleMovement
}) => {
    return (
        <aside
            className={`absolute left-0 top-0 h-full z-40 bg-neutral-900 border-r border-white/5 overflow-y-auto shrink-0 custom-scrollbar transition-all duration-300 ease-in-out shadow-2xl ${showSidebar ? 'w-[320px] p-4 opacity-100' : 'w-0 p-0 opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex items-center gap-2 text-neutral-400 mb-6 px-2">
                <Settings size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Branch Configuration</h2>
            </div>

            <div className="space-y-6 pb-24">
                {arms.map((arm) => (
                    <div key={arm.id} className="bg-black/40 border border-white/5 rounded-xl p-4 space-y-4">
                        <div className="space-y-3 pb-4 border-b border-white/5">
                            <div className="flex items-center gap-2 text-neutral-500 mb-1">
                                <MapPin size={12} />
                                <span className="text-[9px] font-bold uppercase tracking-widest">Street Name</span>
                            </div>
                            <input
                                type="text"
                                value={arm.label}
                                onChange={(e) => updateArm(arm.id, { label: e.target.value })}
                                className="w-full bg-neutral-950 border border-white/10 rounded-lg px-3 py-2 text-sm font-bold text-neutral-100 focus:border-blue-500 outline-none uppercase tracking-wider"
                            />
                            <div className="pt-2">
                                <Slider
                                    label="Offset Angle"
                                    value={arm.angle}
                                    min={-90}
                                    max={90}
                                    unit="°"
                                    onChange={(val) => updateArm(arm.id, { angle: val })}
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <h3 className="text-[9px] font-bold text-emerald-500 uppercase tracking-widest flex items-center gap-2">
                                    <Share2 size={12} className="rotate-180" /> Ingress Channels
                                </h3>
                                 <button
                                     onClick={() => addLane(arm.id, 'ingress')}
                                     disabled={arm.ingressLanes.length >= 5}
                                     className={`p-1 rounded-full transition-colors ${arm.ingressLanes.length >= 5 ? 'text-neutral-700 cursor-not-allowed' : 'hover:bg-emerald-500/10 text-emerald-500'}`}
                                 >
                                     <Plus size={16} />
                                 </button>
                            </div>

                            <div className="space-y-3">
                                {arm.ingressLanes.map((lane, idx) => (
                                    <div key={lane.id} className="bg-neutral-900/40 border border-white/5 p-3 rounded-lg space-y-3">
                                        <div className="flex items-center justify-between gap-3">
                                            <div className="flex items-center gap-2">
                                                <div className="w-2 h-2 rounded-full bg-emerald-500/50" />
                                                <span className="text-[10px] font-black text-neutral-400 uppercase">Lane {idx + 1}</span>
                                            </div>
                                            <button
                                                onClick={() => removeLane(arm.id, 'ingress', lane.id)}
                                                className="text-neutral-700 hover:text-rose-500 transition-colors"
                                            >
                                                <Minus size={14} />
                                            </button>
                                        </div>

                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                value={lane.volume}
                                                onChange={(e) => updateLane(arm.id, 'ingress', lane.id, 'volume', e.target.value)}
                                                className="bg-neutral-950 border border-white/10 rounded-md px-2 py-1.5 text-xs text-neutral-100 w-20 focus:border-blue-500 outline-none font-mono"
                                                placeholder="0"
                                            />
                                            <div className="flex-1 flex gap-1 justify-end">
                                                {['L', 'S', 'R'].map(m => (
                                                    <button
                                                        key={m}
                                                        onClick={() => toggleMovement(arm.id, lane.id, m)}
                                                        className={`w-7 h-7 rounded flex items-center justify-center text-[9px] font-black transition-all ${lane.movements.includes(m) ? 'bg-blue-600 text-white shadow-lg' : 'bg-neutral-950/50 text-neutral-500 hover:text-neutral-300 border border-white/5'}`}
                                                    >
                                                        {m}
                                                    </button>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-4 pt-2">
                            <div className="flex justify-between items-center">
                                 <h3 className="text-[9px] font-bold text-amber-500 uppercase tracking-widest flex items-center gap-2">
                                     <Share2 size={12} /> Egress Channel
                                 </h3>
                            </div>

                            <div className="space-y-2">
                                {arm.egressLanes.map((lane, idx) => (
                                    <div key={lane.id} className="flex items-center gap-3 bg-neutral-900/40 border border-white/5 p-3 rounded-lg">
                                         <div className="w-1.5 h-1.5 rounded-full bg-amber-500/50" />
                                         <span className="text-[10px] font-black text-neutral-400 uppercase whitespace-nowrap">Exit</span>
                                         <input
                                             type="number"
                                             value={lane.volume}
                                             onChange={(e) => updateLane(arm.id, 'egress', lane.id, 'volume', e.target.value)}
                                             className="flex-1 bg-neutral-950 border border-white/10 rounded-md px-2 py-1.5 text-xs text-neutral-100 focus:border-blue-500 outline-none font-mono"
                                             placeholder="0"
                                         />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarLeft;
