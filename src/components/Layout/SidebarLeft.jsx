import React from 'react';
import { Settings, Plus, Minus } from 'lucide-react';

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
            className={`absolute left-0 top-0 h-full z-40 bg-neutral-900 border-r border-white/5 overflow-y-auto shrink-0 custom-scrollbar transition-all duration-300 ease-in-out shadow-2xl ${showSidebar ? 'w-[400px] p-4 opacity-100' : 'w-0 p-0 opacity-0 pointer-events-none'
                }`}
        >
            <div className="flex items-center gap-2 text-neutral-400 mb-6 px-2">
                <Settings size={14} />
                <h2 className="text-[10px] font-black uppercase tracking-[0.2em]">Branch Configuration</h2>
            </div>

            <div className="space-y-12 pb-24">
                {arms.map((arm) => (
                    <div key={arm.id} className="space-y-6">
                        <div className="flex items-center justify-between border-b border-white/10 pb-4">
                            <input
                                type="text"
                                value={arm.label}
                                onChange={(e) => updateArm(arm.id, { label: e.target.value })}
                                className="bg-transparent font-bold text-neutral-100 border-none p-0 focus:ring-0 text-md uppercase tracking-[0.2em]"
                            />
                            <div className="flex items-center gap-4">
                                <span className="text-[10px] text-neutral-500 font-mono font-bold tracking-tighter">OFF: {arm.angle > 0 ? '+' : ''}{arm.angle}°</span>
                                <input
                                    type="range" min="-90" max="90" value={arm.angle}
                                    onChange={(e) => updateArm(arm.id, { angle: parseInt(e.target.value) })}
                                    className="w-24 h-1 bg-neutral-800 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Ingress Channels</label>
                                <button onClick={() => addLane(arm.id, 'ingress')} className="p-1 hover:bg-emerald-500/10 rounded-full text-emerald-500 transition-colors"><Plus size={18} /></button>
                            </div>
                            {arm.ingressLanes.map((lane, idx) => (
                                <div key={lane.id} className="bg-neutral-800/40 border border-white/5 p-4 rounded-xl space-y-4 shadow-xl">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-emerald-500/10 text-emerald-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 whitespace-nowrap uppercase tracking-tighter">Lane {idx + 1}</div>
                                        <input
                                            type="number" value={lane.volume}
                                            onChange={(e) => updateLane(arm.id, 'ingress', lane.id, 'volume', e.target.value)}
                                            className="bg-neutral-950 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-100 w-24 focus:border-blue-500 outline-none font-mono text-white"
                                            placeholder="0"
                                        />
                                        <div className="flex-1 flex gap-1 justify-end">
                                            {['L', 'S', 'R'].map(m => (
                                                <button
                                                    key={m}
                                                    onClick={() => toggleMovement(arm.id, lane.id, m)}
                                                    className={`w-8 h-8 rounded-md flex items-center justify-center text-[10px] font-black transition-all ${lane.movements.includes(m) ? 'bg-blue-600 text-white shadow-lg' : 'bg-neutral-900 text-neutral-500 hover:text-neutral-300'}`}
                                                >
                                                    {m}
                                                </button>
                                            ))}
                                        </div>
                                        <button onClick={() => removeLane(arm.id, 'ingress', lane.id)} className="text-neutral-700 hover:text-rose-500 ml-2"><Minus size={18} /></button>
                                    </div>
                                </div>
                            ))}
                        </div>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <label className="text-[9px] font-black text-amber-500 uppercase tracking-widest">Egress Channels</label>
                                <button onClick={() => addLane(arm.id, 'egress')} className="p-1 hover:bg-amber-500/10 rounded-full text-amber-500 transition-colors"><Plus size={18} /></button>
                            </div>
                            {arm.egressLanes.map((lane, idx) => (
                                <div key={lane.id} className="flex items-center gap-4 bg-neutral-800/40 border border-white/5 p-4 rounded-xl shadow-xl">
                                    <div className="bg-amber-500/10 text-amber-500 text-[10px] font-black px-3 py-1.5 rounded-lg border border-emerald-500/20 whitespace-nowrap uppercase tracking-tighter">Exit {idx + 1}</div>
                                    <input
                                        type="number" value={lane.volume}
                                        onChange={(e) => updateLane(arm.id, 'egress', lane.id, 'volume', e.target.value)}
                                        className="flex-1 bg-neutral-950 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-100 focus:border-blue-500 outline-none font-mono text-white"
                                        placeholder="0"
                                    />
                                    <button onClick={() => removeLane(arm.id, 'egress', lane.id)} className="text-neutral-700 hover:text-rose-500"><Minus size={18} /></button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </aside>
    );
};

export default SidebarLeft;
