import React from 'react';
import { ArrowUp, ArrowUpLeft, ArrowUpRight } from 'lucide-react';
import { getReadableFlip } from '../../utils/geoUtils';

const IntersectionArm = ({
    arm,
    hubSize,
    globalRotation,
    medianPadding,
    medianHeight,
    laneGap,
    laneHeight,
    labelHorizontalOffset,
    editingLaneId,
    setEditingLaneId,
    editingArmId,
    setEditingArmId,
    updateLane,
    updateArm,
    canvasViewMode
}) => {
    const totalArmAngle = arm.baseAngle + arm.angle;
    const textFlip = getReadableFlip(totalArmAngle, globalRotation);

    return (
        <div
            className="absolute top-1/2 left-1/2 origin-left transition-transform duration-500 ease-in-out z-50"
            style={{
                transform: `rotate(${totalArmAngle - 90}deg)`,
                width: '1200px'
            }}
        >
            <div
                className="relative flex flex-col justify-center"
                style={{ marginLeft: `${hubSize / 2}px`, height: '0px' }}
            >
                {/* Ingress Section */}
                <div className="absolute bottom-[0px] w-full flex flex-col-reverse items-start" style={{ paddingBottom: `${medianPadding + medianHeight / 2}px`, gap: `${laneGap}px` }}>
                    {arm.ingressLanes.map((lane, idx) => (
                        <div
                            key={lane.id}
                            className="w-full bg-gradient-to-r from-emerald-950/80 to-transparent relative border-l-[6px] border-emerald-500"
                            style={{ height: `${laneHeight}px` }}
                        >
                            <div className="absolute left-0 h-full w-1 bg-white shadow-[0_0_8px_white]" />
                            {canvasViewMode === 'arrows' ? (
                                <div className="absolute left-[96px] top-1/2 -translate-y-1/2 flex flex-row gap-6">
                                    {lane.movements.includes('S') && <ArrowUp size={32} className="text-emerald-400 opacity-90 -rotate-90" />}
                                    {lane.movements.includes('L') && <ArrowUpLeft size={32} className="text-emerald-400 opacity-90 -rotate-90" />}
                                    {lane.movements.includes('R') && <ArrowUpRight size={32} className="text-emerald-400 opacity-90 -rotate-90" />}
                                </div>
                            ) : (
                                <div
                                    className="absolute z-50 transition-all duration-500 cursor-text flex items-center whitespace-nowrap"
                                    style={{
                                        left: `${labelHorizontalOffset}px`,
                                        top: '50%',
                                        transform: `translateY(-50%) rotate(${textFlip}deg)`
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingLaneId(`${lane.id}-name`);
                                    }}
                                >
                                    {editingLaneId === `${lane.id}-name` ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={lane.name}
                                            onChange={(e) => updateLane(arm.id, 'ingress', lane.id, 'name', e.target.value)}
                                            onBlur={() => setEditingLaneId(null)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setEditingLaneId(null);
                                            }}
                                            className="bg-neutral-900/80 border border-emerald-500 text-sm font-black tracking-[0.3em] text-white uppercase outline-none px-2 py-1 rounded"
                                            style={{ minWidth: (lane.name?.length || 4) * 1.5 + 'ch' }}
                                        />
                                    ) : (
                                        <span className="text-sm font-black tracking-[0.3em] text-white uppercase opacity-90 hover:opacity-100 transition-opacity">
                                            {lane.name || 'Lane'}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div
                                className="absolute left-12 top-1/2 -translate-y-1/2 text-[13px] font-mono font-black text-emerald-400 transition-transform duration-500 cursor-text z-50"
                                style={{ transform: `translateY(-50%) rotate(${textFlip}deg)` }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLaneId(lane.id);
                                }}
                            >
                                {editingLaneId === lane.id ? (
                                    <input
                                        autoFocus
                                        type="number"
                                        value={lane.volume}
                                        onChange={(e) => updateLane(arm.id, 'ingress', lane.id, 'volume', e.target.value)}
                                        onBlur={() => setEditingLaneId(null)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setEditingLaneId(null);
                                        }}
                                        className="bg-neutral-900/80 border border-emerald-500 text-[13px] font-mono font-black text-emerald-400 outline-none px-1 rounded w-16"
                                    />
                                ) : (
                                    <span className="opacity-90 hover:opacity-100 transition-opacity">
                                        {lane.volume}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* CENTERLINE MEDIAN */}
                <div
                    className="absolute w-full bg-neutral-100/10 flex items-center justify-center"
                    style={{
                        height: `${medianHeight}px`,
                        transform: 'translateY(-50%)'
                    }}
                >
                    <div className="w-full h-[2px] bg-neutral-200/40 shadow-[0_0_12px_rgba(255,255,255,0.4)]" />
                </div>

                {/* Egress Section */}
                <div className="absolute top-[0px] w-full flex flex-col items-start" style={{ paddingTop: `${medianPadding + medianHeight / 2}px`, gap: `${laneGap}px` }}>
                    {canvasViewMode === 'arrows' && (
                        <div
                            className="absolute whitespace-nowrap z-50 transition-all duration-500 cursor-text flex items-center"
                            style={{
                                left: `${labelHorizontalOffset}px`,
                                top: `${medianPadding + medianHeight / 2 + laneHeight / 2}px`,
                                transform: `translateY(-50%) rotate(${textFlip}deg)`
                            }}
                            onClick={(e) => {
                                e.stopPropagation();
                                setEditingArmId(arm.id);
                            }}
                        >
                            {editingArmId === arm.id ? (
                                <input
                                    autoFocus
                                    type="text"
                                    value={arm.label}
                                    onChange={(e) => updateArm(arm.id, { label: e.target.value })}
                                    onBlur={() => setEditingArmId(null)}
                                    onKeyDown={(e) => {
                                        if (e.key === 'Enter') setEditingArmId(null);
                                    }}
                                    className="bg-neutral-900/80 border border-blue-500 text-sm font-black tracking-[0.3em] text-white uppercase outline-none px-2 py-1 rounded"
                                    style={{ minWidth: (arm.label.length || 1) * 1.5 + 'ch' }}
                                />
                            ) : (
                                <span className="text-sm font-black tracking-[0.3em] text-white uppercase opacity-90 hover:opacity-100 transition-opacity">
                                    {arm.label || 'Unnamed'}
                                </span>
                            )}
                        </div>
                    )}

                    {arm.egressLanes.map((lane, idx) => (
                        <div
                            key={lane.id}
                            className="w-full bg-gradient-to-r from-amber-950/80 to-transparent relative border-l-[6px] border-amber-600/70"
                            style={{ height: `${laneHeight}px` }}
                        >
                            {canvasViewMode === 'zones' && (
                                <div
                                    className="absolute z-50 transition-all duration-500 cursor-text flex items-center whitespace-nowrap"
                                    style={{
                                        left: `${labelHorizontalOffset}px`,
                                        top: '50%',
                                        transform: `translateY(-50%) rotate(${textFlip}deg)`
                                    }}
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setEditingLaneId(`${lane.id}-name`);
                                    }}
                                >
                                    {editingLaneId === `${lane.id}-name` ? (
                                        <input
                                            autoFocus
                                            type="text"
                                            value={lane.name}
                                            onChange={(e) => updateLane(arm.id, 'egress', lane.id, 'name', e.target.value)}
                                            onBlur={() => setEditingLaneId(null)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter') setEditingLaneId(null);
                                            }}
                                            className="bg-neutral-900/80 border border-amber-500 text-sm font-black tracking-[0.3em] text-white uppercase outline-none px-2 py-1 rounded"
                                            style={{ minWidth: (lane.name?.length || 4) * 1.5 + 'ch' }}
                                        />
                                    ) : (
                                        <span className="text-sm font-black tracking-[0.3em] text-white uppercase opacity-90 hover:opacity-100 transition-opacity">
                                            {lane.name || 'Exit'}
                                        </span>
                                    )}
                                </div>
                            )}
                            <div
                                className="absolute left-12 top-1/2 -translate-y-1/2 text-[13px] font-mono font-black text-amber-500 tracking-tighter transition-transform duration-500 cursor-text z-50"
                                style={{ transform: `translateY(-50%) rotate(${textFlip}deg)` }}
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setEditingLaneId(lane.id);
                                }}
                            >
                                {editingLaneId === lane.id ? (
                                    <input
                                        autoFocus
                                        type="number"
                                        value={lane.volume}
                                        onChange={(e) => updateLane(arm.id, 'egress', lane.id, 'volume', e.target.value)}
                                        onBlur={() => setEditingLaneId(null)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') setEditingLaneId(null);
                                        }}
                                        className="bg-neutral-900/80 border border-amber-500 text-[13px] font-mono font-black text-amber-500 outline-none px-1 rounded w-16"
                                    />
                                ) : (
                                    <span className="opacity-90 hover:opacity-100 transition-opacity">
                                        {lane.volume}
                                    </span>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default IntersectionArm;
