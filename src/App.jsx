import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import {
    Settings,
    Map as MapIcon,
    Activity,
    AlertTriangle,
    CheckCircle2,
    Plus,
    Minus,
    Navigation,
    ArrowUp,
    ArrowUpRight,
    ArrowUpLeft,
    RotateCw,
    PanelLeftClose,
    PanelLeftOpen,
    PanelRightClose,
    PanelRightOpen,
    Layers,
    Eye,
    Palette,
    Download,
    Upload,
    Maximize,
    ZoomIn,
    ZoomOut
} from 'lucide-react';

const BRANCH_COLORS = {
    0: '#3b82f6',   // Blue (North)
    90: '#a855f7',  // Purple (East)
    180: '#f59e0b', // Amber (South)
    270: '#ec4899'  // Pink (West)
};

const App = () => {
    const [type, setType] = useState('4-way');
    const [showMap, setShowMap] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDebugSidebar, setShowDebugSidebar] = useState(false);
    const [showFlowPanel, setShowFlowPanel] = useState(true);
    const [flowPanelPosition, setFlowPanelPosition] = useState('bottom-right');
    const [globalRotation, setGlobalRotation] = useState(0);
    const [editingArmId, setEditingArmId] = useState(null);
    const [editingLaneId, setEditingLaneId] = useState(null);
    const [arms, setArms] = useState([
        {
            id: 1,
            baseAngle: 0,
            angle: 0,
            label: 'North',
            ingressLanes: [
                { id: 'i1-1', volume: 150, movements: ['S', 'R'] },
                { id: 'i1-2', volume: 120, movements: ['L'] }
            ],
            egressLanes: [{ id: 'e1-1', volume: 270 }]
        },
        {
            id: 2,
            baseAngle: 90,
            angle: 0,
            label: 'East',
            ingressLanes: [{ id: 'i2-1', volume: 300, movements: ['S'] }],
            egressLanes: [{ id: 'e2-1', volume: 300 }]
        },
        {
            id: 3,
            baseAngle: 180,
            angle: 0,
            label: 'South',
            ingressLanes: [
                { id: 'i3-1', volume: 100, movements: ['S'] },
                { id: 'i3-2', volume: 200, movements: ['R'] }
            ],
            egressLanes: [{ id: 'e3-1', volume: 300 }]
        },
        {
            id: 4,
            baseAngle: 270,
            angle: 0,
            label: 'West',
            ingressLanes: [{ id: 'i4-1', volume: 150, movements: ['L', 'S', 'R'] }],
            egressLanes: [{ id: 'e4-1', volume: 150 }]
        },
    ]);
    const [labelHorizontalOffset, setLabelHorizontalOffset] = useState(111);

    const laneHeight = 48;
    const laneGap = 3;
    const medianHeight = 12;
    const medianPadding = 8;

    const hubSize = useMemo(() => {
        const maxLanesPerArm = Math.max(...arms.map(a => a.ingressLanes.length + a.egressLanes.length));
        const maxRoadWidth = maxLanesPerArm * (laneHeight + laneGap) + (medianHeight + medianPadding * 2);
        return Math.max(500, maxRoadWidth + 180);
    }, [arms]);

    const [zoom, setZoom] = useState(1);
    const mainCanvasRef = useRef(null);

    const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.1, 3));
    const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.1, 0.1));

    const handleAutoFit = useCallback(() => {
        if (!mainCanvasRef.current) return;
        
        const canvasWidth = mainCanvasRef.current.clientWidth;
        const canvasHeight = mainCanvasRef.current.clientHeight;
        
        // Calculate the bounding box of the scene in viewport coordinates
        let minX = -hubSize / 2;
        let maxX = hubSize / 2;
        let minY = -hubSize / 2;
        let maxY = hubSize / 2;

        const buffer = 150; // Buffer for labels and arrows
        const labelDist = (hubSize / 2) + labelHorizontalOffset + buffer;

        arms.forEach(arm => {
            const totalAngle = (arm.baseAngle + arm.angle + globalRotation) % 360;
            const rad = (totalAngle * Math.PI) / 180;
            
            const x = labelDist * Math.sin(rad);
            const y = -labelDist * Math.cos(rad);
            
            minX = Math.min(minX, x);
            maxX = Math.max(maxX, x);
            minY = Math.min(minY, y);
            maxY = Math.max(maxY, y);
        });

        const contentWidth = maxX - minX;
        const contentHeight = maxY - minY;
        
        const scaleX = (canvasWidth - 80) / contentWidth;
        const scaleY = (canvasHeight - 80) / contentHeight;
        const newZoom = Math.min(scaleX, scaleY, 1.5);
        
        setZoom(newZoom);
    }, [hubSize, labelHorizontalOffset, arms, globalRotation, showSidebar, showDebugSidebar]);

    useEffect(() => {
        handleAutoFit();
    }, []); // Only on initial load

    useEffect(() => {
        const handleWheel = (e) => {
            if (e.ctrlKey || e.metaKey) {
                e.preventDefault();
                const delta = e.deltaY > 0 ? -0.05 : 0.05;
                setZoom(prev => Math.max(0.1, Math.min(3, prev + delta)));
            }
        };

        const canvas = mainCanvasRef.current;
        if (canvas) {
            canvas.addEventListener('wheel', handleWheel, { passive: false });
        }
        return () => {
            if (canvas) {
                canvas.removeEventListener('wheel', handleWheel);
            }
        };
    }, []);

    // Import/Export Logic
    const handleExport = () => {
        const config = {
            arms,
            type,
            globalRotation,
            hubMode,
            ribbonOverlap,
            hubOverlap,
            hubWidthOffset,
            showLegend,
            legendPosition,
            showMap,
            canvasBg,
            showInternalRibbons,
            useFixedRibbonWidth,
            labelHorizontalOffset,
            timestamp: new Date().toISOString()
        };
        const blob = new Blob([JSON.stringify(config, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `intersection-setup-${new Date().toISOString().slice(0, 10)}.json`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    const handleImport = (event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const config = JSON.parse(e.target.result);
                if (config.arms) setArms(config.arms);
                if (config.type !== undefined) setType(config.type);
                if (config.globalRotation !== undefined) setGlobalRotation(config.globalRotation);
                if (config.hubMode !== undefined) setHubMode(config.hubMode);
                if (config.ribbonOverlap !== undefined) setRibbonOverlap(config.ribbonOverlap);
                if (config.hubOverlap !== undefined) setHubOverlap(config.hubOverlap);
                if (config.hubWidthOffset !== undefined) setHubWidthOffset(config.hubWidthOffset);
                if (config.showLegend !== undefined) setShowLegend(config.showLegend);
                if (config.legendPosition !== undefined) setLegendPosition(config.legendPosition);
                if (config.showMap !== undefined) setShowMap(config.showMap);
                if (config.canvasBg !== undefined) setCanvasBg(config.canvasBg);
                if (config.showInternalRibbons !== undefined) setShowInternalRibbons(config.showInternalRibbons);
                if (config.useFixedRibbonWidth !== undefined) setUseFixedRibbonWidth(config.useFixedRibbonWidth);
                if (config.labelHorizontalOffset !== undefined) setLabelHorizontalOffset(config.labelHorizontalOffset);
            } catch (err) {
                console.error("Failed to import configuration:", err);
                alert("Invalid configuration file.");
            }
        };
        reader.readAsText(file);
    };

    // Debug & Visualization States
    const [hubMode, setHubMode] = useState(2); // 0: None, 1: Rect, 2: Adaptive
    const [showInternalRibbons, setShowInternalRibbons] = useState(true);
    const [showLegend, setShowLegend] = useState(true);
    const [legendPosition, setLegendPosition] = useState('bottom-right'); // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
    const [useFixedRibbonWidth, setUseFixedRibbonWidth] = useState(false);
    const [ribbonOverlap, setRibbonOverlap] = useState(-30);
    const [hubOverlap, setHubOverlap] = useState(100);
    const [hubWidthOffset, setHubWidthOffset] = useState(35);
    const [canvasBg, setCanvasBg] = useState('bg-[#1e293b]');


    useEffect(() => {
        if (type === '3-way') {
            setArms(prev => prev.slice(0, 3));
        } else if (type === '4-way' && arms.length < 4) {
            setArms([...arms, {
                id: 4,
                baseAngle: 270,
                angle: 0,
                label: 'West',
                ingressLanes: [{ id: 'i4-1', volume: 150, movements: ['S'] }],
                egressLanes: [{ id: 'e4-1', volume: 150 }]
            }]);
        }
    }, [type]);

    const totalIngress = useMemo(() =>
        arms.reduce((sum, arm) => sum + arm.ingressLanes.reduce((s, l) => s + (parseInt(l.volume) || 0), 0), 0)
        , [arms]);

    const totalEgress = useMemo(() =>
        arms.reduce((sum, arm) => sum + arm.egressLanes.reduce((s, l) => s + (parseInt(l.volume) || 0), 0), 0)
        , [arms]);

    const delta = totalIngress - totalEgress;
    const deltaPercent = totalIngress > 0 ? (Math.abs(delta) / totalIngress) * 100 : 0;

    const updateArm = (id, updates) => {
        setArms(arms.map(a => a.id === id ? { ...a, ...updates } : a));
    };

    const addLane = (armId, type) => {
        const arm = arms.find(a => a.id === armId);
        const listKey = type === 'ingress' ? 'ingressLanes' : 'egressLanes';
        const newLane = type === 'ingress'
            ? { id: `i${armId}-${Date.now()}`, volume: 0, movements: ['S'] }
            : { id: `e${armId}-${Date.now()}`, volume: 0 };
        updateArm(armId, { [listKey]: [...arm[listKey], newLane] });
    };

    const removeLane = (armId, type, laneId) => {
        const arm = arms.find(a => a.id === armId);
        const listKey = type === 'ingress' ? 'ingressLanes' : 'egressLanes';
        if (arm[listKey].length <= 1) return;
        updateArm(armId, { [listKey]: arm[listKey].filter(l => l.id !== laneId) });
    };

    const updateLane = (armId, type, laneId, field, value) => {
        const arm = arms.find(a => a.id === armId);
        const listKey = type === 'ingress' ? 'ingressLanes' : 'egressLanes';
        const newLanes = arm[listKey].map(l => l.id === laneId ? { ...l, [field]: value } : l);
        updateArm(armId, { [listKey]: newLanes });
    };

    const toggleMovement = (armId, laneId, move) => {
        const arm = arms.find(a => a.id === armId);
        const lane = arm.ingressLanes.find(l => l.id === laneId);
        const newMoves = lane.movements.includes(move)
            ? lane.movements.filter(m => m !== move)
            : [...lane.movements, move];
        updateLane(armId, 'ingress', laneId, 'movements', newMoves);
    };

    const getStatusColor = () => {
        if (Math.abs(delta) === 0) return 'text-emerald-400';
        if (deltaPercent < 5) return 'text-amber-400';
        return 'text-rose-400';
    };


    const getReadableFlip = (armTotalAngle) => {
        let angle = (globalRotation + armTotalAngle) % 360;
        if (angle < 0) angle += 360;
        if (angle > 135 && angle <= 315) {
            return 180;
        }
        return 0;
    };

    const internalPaths = useMemo(() => {
        const paths = [];
        const r = hubSize / 2;

        const getLanePoint = (arm, type, laneIdx) => {
            const angleRad = ((arm.baseAngle + arm.angle) * Math.PI) / 180;
            let offset = medianHeight / 2 + medianPadding + (laneIdx * (laneHeight + laneGap)) + laneHeight / 2;
            const perpOffset = (type === 'ingress') ? -offset : offset;
            return {
                x: r * Math.sin(angleRad) + perpOffset * Math.cos(angleRad),
                y: -r * Math.cos(angleRad) + perpOffset * Math.sin(angleRad),
                angleRad
            };
        };

        arms.forEach((sourceArm) => {
            sourceArm.ingressLanes.forEach((lane, lIdx) => {
                lane.movements.forEach((move) => {
                    let targetBase;
                    if (move === 'S') targetBase = (sourceArm.baseAngle + 180) % 360;
                    if (move === 'L') targetBase = (sourceArm.baseAngle + 90) % 360;
                    if (move === 'R') targetBase = (sourceArm.baseAngle + 270) % 360;

                    const targetArm = arms.find(a => Math.abs(a.baseAngle - targetBase) < 5);

                    if (targetArm && targetArm.egressLanes.length > 0) {
                        const start = getLanePoint(sourceArm, 'ingress', lIdx);
                        const eIdx = Math.min(lIdx, targetArm.egressLanes.length - 1);
                        const end = getLanePoint(targetArm, 'egress', eIdx);

                        // Calculate offset points for straight lead-in
                        const startOff = {
                            x: start.x - ribbonOverlap * Math.sin(start.angleRad),
                            y: start.y + ribbonOverlap * Math.cos(start.angleRad)
                        };
                        const endOff = {
                            x: end.x - ribbonOverlap * Math.sin(end.angleRad),
                            y: end.y + ribbonOverlap * Math.cos(end.angleRad)
                        };

                        const cpDist = move === 'S' ? r * 0.45 : r * 0.75;
                        const cp1 = {
                            x: startOff.x - cpDist * Math.sin(start.angleRad),
                            y: startOff.y + cpDist * Math.cos(start.angleRad)
                        };
                        const cp2 = {
                            x: endOff.x - cpDist * Math.sin(end.angleRad),
                            y: endOff.y + cpDist * Math.cos(end.angleRad)
                        };

                        paths.push({
                            id: `${sourceArm.label}-${lane.id}-${move}`,
                            d: `M ${start.x} ${start.y} L ${startOff.x} ${startOff.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endOff.x} ${endOff.y} L ${end.x} ${end.y}`,
                            volume: lane.volume,
                            color: BRANCH_COLORS[targetArm.baseAngle] || '#94a3b8'
                        });
                    }
                });
            });
        });

        return paths;
    }, [arms, hubSize, ribbonOverlap]);

    const dynamicHubPath = useMemo(() => {
        if (hubMode !== 2) return "";
        const r = hubSize / 2;
        const points = [];
        const sortedArms = [...arms].sort((a, b) => (a.baseAngle + a.angle) - (b.baseAngle + b.angle));

        sortedArms.forEach(arm => {
            const angleRad = ((arm.baseAngle + arm.angle) * Math.PI) / 180;
            const ingressWidth = (arm.ingressLanes.length * (laneHeight + laneGap)) + medianPadding + medianHeight / 2 + hubWidthOffset;
            const egressWidth = (arm.egressLanes.length * (laneHeight + laneGap)) + medianPadding + medianHeight / 2 + hubWidthOffset;

            const sinA = Math.sin(angleRad);
            const cosA = Math.cos(angleRad);

            // Left inner (Stop line corner)
            points.push({
                x: r * sinA - ingressWidth * cosA,
                y: -r * cosA - ingressWidth * sinA
            });

            // Left outer (Overlap extension)
            points.push({
                x: (r + hubOverlap) * sinA - ingressWidth * cosA,
                y: -(r + hubOverlap) * cosA - ingressWidth * sinA
            });

            // Right outer (Overlap extension)
            points.push({
                x: (r + hubOverlap) * sinA + egressWidth * cosA,
                y: -(r + hubOverlap) * cosA + egressWidth * sinA
            });

            // Right inner (Stop line corner)
            points.push({
                x: r * sinA + egressWidth * cosA,
                y: -r * cosA + egressWidth * sinA
            });
        });

        if (points.length === 0) return "";
        
        const cornerRadius = 40;
        const n = points.length;
        let d = "";

        for (let i = 0; i < n; i++) {
            const p1 = points[(i - 1 + n) % n];
            const p2 = points[i];
            const p3 = points[(i + 1) % n];

            const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
            const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

            const l1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
            const l2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

            const currentR = Math.min(cornerRadius, l1 / 2, l2 / 2);
            const cp1 = { x: p2.x + (v1.x / l1) * currentR, y: p2.y + (v1.y / l1) * currentR };
            const cp2 = { x: p2.x + (v2.x / l2) * currentR, y: p2.y + (v2.y / l2) * currentR };

            if (i === 0) {
                d += `M ${cp1.x} ${cp1.y} `;
            } else {
                d += `L ${cp1.x} ${cp1.y} `;
            }
            d += `Q ${p2.x} ${p2.y} ${cp2.x} ${cp2.y} `;
        }

        return d + " Z";
    }, [arms, hubSize, hubMode, laneHeight, laneGap, medianPadding, medianHeight, hubOverlap, hubWidthOffset]);

    const hubBoundaryPath = useMemo(() => {
        if (hubMode !== 2) return "";
        const r = hubSize / 2;
        const points = [];
        const sortedArms = [...arms].sort((a, b) => (a.baseAngle + a.angle) - (b.baseAngle + b.angle));

        sortedArms.forEach(arm => {
            const angleRad = ((arm.baseAngle + arm.angle) * Math.PI) / 180;
            const ingressWidth = (arm.ingressLanes.length * (laneHeight + laneGap)) + medianPadding + medianHeight / 2 + hubWidthOffset;
            const egressWidth = (arm.egressLanes.length * (laneHeight + laneGap)) + medianPadding + medianHeight / 2 + hubWidthOffset;

            const sinA = Math.sin(angleRad);
            const cosA = Math.cos(angleRad);

            // Left inner (Stop line corner)
            points.push({
                x: r * sinA - ingressWidth * cosA,
                y: -r * cosA - ingressWidth * sinA
            });

            // Right inner (Stop line corner)
            points.push({
                x: r * sinA + egressWidth * cosA,
                y: -r * cosA + egressWidth * sinA
            });
        });

        if (points.length === 0) return "";
        
        const cornerRadius = 40;
        const n = points.length;
        let d = "";

        for (let i = 0; i < n; i++) {
            const p1 = points[(i - 1 + n) % n];
            const p2 = points[i];
            const p3 = points[(i + 1) % n];

            const v1 = { x: p1.x - p2.x, y: p1.y - p2.y };
            const v2 = { x: p3.x - p2.x, y: p3.y - p2.y };

            const l1 = Math.sqrt(v1.x * v1.x + v1.y * v1.y);
            const l2 = Math.sqrt(v2.x * v2.x + v2.y * v2.y);

            const currentR = Math.min(cornerRadius, l1 / 2, l2 / 2);
            const cp1 = { x: p2.x + (v1.x / l1) * currentR, y: p2.y + (v1.y / l1) * currentR };
            const cp2 = { x: p2.x + (v2.x / l2) * currentR, y: p2.y + (v2.y / l2) * currentR };

            if (i === 0) {
                d += `M ${cp1.x} ${cp1.y} `;
            } else {
                d += `L ${cp1.x} ${cp1.y} `;
            }
            d += `Q ${p2.x} ${p2.y} ${cp2.x} ${cp2.y} `;
        }

        return d + " Z";
    }, [arms, hubSize, hubMode, laneHeight, laneGap, medianPadding, medianHeight, hubWidthOffset]);

    return (
        <div className={`flex flex-col h-screen ${canvasBg} text-neutral-100 font-sans overflow-hidden transition-colors duration-500`}>
            {/* Header */}
            <header className="px-6 py-2 bg-neutral-900 border-b border-white/5 flex justify-between items-center z-50 shadow-lg shrink-0">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => setShowSidebar(!showSidebar)}
                        className="p-1.5 hover:bg-white/10 rounded-lg transition-colors text-neutral-400 mr-1"
                        title={showSidebar ? "Hide Controls" : "Show Controls"}
                    >
                        {showSidebar ? <PanelLeftClose size={18} /> : <PanelLeftOpen size={18} />}
                    </button>
                    <div className="flex items-center">
                        <Activity size={20} className="text-emerald-500" />
                    </div>
                    <h1 className="text-lg font-bold tracking-tight">Flow Architect</h1>
                </div>

                <div className="flex items-center gap-6">
                    <div className="hidden lg:flex items-center gap-2 bg-neutral-800/50 px-3 py-1 rounded-full border border-white/5">
                        <RotateCw size={12} className="text-neutral-500" />
                        <span className="text-[9px] font-black tracking-widest text-neutral-400 uppercase w-16">Spin</span>
                        <input
                            type="range" min="-90" max="90" value={globalRotation}
                            onChange={(e) => setGlobalRotation(parseInt(e.target.value))}
                            className="w-24 h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                        />
                        <span className="text-[9px] font-mono text-blue-400 w-6 text-right">{globalRotation}°</span>
                    </div>

                    <div className="flex gap-2">
                        <button
                            onClick={handleExport}
                            className="p-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all flex items-center gap-2"
                            title="Export Configuration"
                        >
                            <Download size={14} />
                            <span className="hidden xl:inline text-[8px] font-black uppercase tracking-widest">Export</span>
                        </button>
                        <div className="relative">
                            <input
                                type="file"
                                id="import-config"
                                className="hidden"
                                accept=".json"
                                onChange={handleImport}
                            />
                            <label
                                htmlFor="import-config"
                                className="p-1.5 bg-neutral-800 border border-neutral-700 rounded-lg text-neutral-400 hover:bg-neutral-700 hover:text-white transition-all flex items-center gap-2 cursor-pointer"
                                title="Import Configuration"
                            >
                                <Upload size={14} />
                                <span className="hidden xl:inline text-[8px] font-black uppercase tracking-widest">Import</span>
                            </label>
                        </div>
                        <button
                            onClick={() => setShowMap(!showMap)}
                            className={`px-3 py-1.5 rounded-full flex items-center gap-2 text-[9px] font-black tracking-widest transition-all border ${showMap ? 'bg-blue-600 border-blue-500 text-white' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                        >
                            <MapIcon size={12} /> {showMap ? 'SATELLITE' : 'SCHEMATIC'}
                        </button>
                        <button
                            onClick={() => setShowDebugSidebar(!showDebugSidebar)}
                            className={`p-1.5 rounded-lg transition-colors border ${showDebugSidebar ? 'bg-amber-600/20 border-amber-500 text-amber-400' : 'bg-neutral-800 border-neutral-700 text-neutral-400 hover:bg-neutral-700'}`}
                            title="View Settings"
                        >
                            {showDebugSidebar ? <PanelRightClose size={18} /> : <PanelRightOpen size={18} />}
                        </button>
                    </div>
                </div>
            </header>

            <div className="flex flex-1 overflow-hidden relative">
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
                                                    className="bg-neutral-950 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-100 w-24 focus:border-blue-500 outline-none font-mono"
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
                                                className="flex-1 bg-neutral-950 border border-white/10 rounded-md px-3 py-2 text-xs text-neutral-100 focus:border-blue-500 outline-none font-mono"
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

                {/* MAIN CANVAS */}
                <main ref={mainCanvasRef} className="flex-1 relative overflow-hidden flex flex-col transition-colors duration-500">
                    <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                        {/* Zoom Control Panel */}
                        <div className="absolute top-6 right-6 z-20 flex flex-col gap-2">
                            <button
                                onClick={handleZoomIn}
                                className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all shadow-xl"
                                title="Zoom In"
                            >
                                <ZoomIn size={20} />
                            </button>
                            <button
                                onClick={handleZoomOut}
                                className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl text-neutral-400 hover:text-white hover:bg-neutral-800 transition-all shadow-xl"
                                title="Zoom Out"
                            >
                                <ZoomOut size={20} />
                            </button>
                            <button
                                onClick={handleAutoFit}
                                className="p-3 bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-xl text-blue-400 hover:text-blue-300 hover:bg-neutral-800 transition-all shadow-xl mt-2"
                                title="Fit to View"
                            >
                                <Maximize size={20} />
                            </button>
                            <div className="bg-neutral-900/80 backdrop-blur-md border border-white/10 rounded-lg px-2 py-1 text-[10px] font-mono text-neutral-500 text-center shadow-lg">
                                {Math.round(zoom * 100)}%
                            </div>
                        </div>

                        <div 
                            className="relative flex items-center justify-center transition-transform duration-300 ease-out"
                            style={{ transform: `scale(${zoom})` }}
                        >
                            {/* Grid Overlay */}
                        {showMap && (
                            <div className="absolute inset-0 opacity-[0.04] pointer-events-none">
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,1) 2.5px, transparent 2.5px), linear-gradient(90deg, rgba(255,255,255,1) 2.5px, transparent 2.5px)`,
                                    backgroundSize: '240px 240px'
                                }} />
                                <div className="absolute inset-0" style={{
                                    backgroundImage: `linear-gradient(rgba(255,255,255,.5) 1.5px, transparent 1.5px), linear-gradient(90deg, rgba(255,255,255,.5) 1.5px, transparent 1.5px)`,
                                    backgroundSize: '60px 60px'
                                }} />
                            </div>
                        )}

                        {/* JUNCTION CORE */}
                        <div
                            className={`relative z-30 transition-all duration-500 ease-in-out rounded-[2.5rem] flex items-center justify-center overflow-visible ${hubMode === 1 ? 'bg-[#161616] border-2 border-white/15 shadow-[0_0_120px_rgba(0,0,0,1)]' : 'bg-transparent border-none shadow-none'
                                }`}
                            style={{
                                width: `${hubSize}px`,
                                height: `${hubSize}px`,
                                transform: `rotate(${globalRotation}deg)`
                            }}
                        >
                            {/* HUB GEOMETRY 2: Dynamic Polygon */}
                            {hubMode === 2 && (
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                                    viewBox={`-${hubSize / 2} -${hubSize / 2} ${hubSize} ${hubSize}`}
                                >
                                    <path
                                        d={dynamicHubPath}
                                        fill="#161616"
                                        stroke="rgba(255,255,255,0.15)"
                                        strokeWidth="2"
                                        className="transition-all duration-500"
                                        style={{ filter: 'drop-shadow(0 0 40px rgba(0,0,0,1))' }}
                                    />
                                </svg>
                            )}

                            {/* INTERNAL RIBBONS */}
                            {showInternalRibbons && (
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none overflow-visible"
                                    viewBox={`-${hubSize / 2} -${hubSize / 2} ${hubSize} ${hubSize}`}
                                >
                                    <defs>
                                        <clipPath id="hub-clip">
                                            {hubMode === 1 ? (
                                                <rect
                                                    x={-hubSize / 2}
                                                    y={-hubSize / 2}
                                                    width={hubSize}
                                                    height={hubSize}
                                                    rx="40"
                                                />
                                            ) : hubMode === 2 ? (
                                                <path d={hubBoundaryPath} />
                                            ) : (
                                                <rect
                                                    x={-hubSize / 2}
                                                    y={-hubSize / 2}
                                                    width={hubSize}
                                                    height={hubSize}
                                                />
                                            )}
                                        </clipPath>
                                    </defs>
                                    <g clipPath="url(#hub-clip)">
                                        {internalPaths.map((path) => (
                                            <path
                                                key={path.id}
                                                d={path.d}
                                                fill="none"
                                                stroke={path.color}
                                                strokeWidth={useFixedRibbonWidth ? 32 : Math.max(10, Math.min(26, (path.volume / 100) * 8))}
                                                strokeOpacity="0.85"
                                                strokeLinecap="round"
                                                className="transition-all duration-700"
                                            />
                                        ))}
                                    </g>
                                </svg>
                            )}

                            <div className={`absolute inset-10 border border-white/[0.04] rounded-[2rem] pointer-events-none flex items-center justify-center ${hubMode === 0 && 'hidden'}`}>
                                <Navigation size={hubSize / 6} className="text-neutral-100 opacity-5 rotate-45" />
                            </div>

                            {/* Render Intersection Arms */}
                            {arms.map((arm) => {
                                const totalArmAngle = arm.baseAngle + arm.angle;
                                const textFlip = getReadableFlip(totalArmAngle);

                                return (
                                    <div
                                        key={arm.id}
                                        className="absolute top-1/2 left-1/2 origin-left transition-transform duration-500 ease-in-out"
                                        style={{
                                            transform: `rotate(${totalArmAngle - 90}deg)`,
                                            width: '1200px'
                                        }}
                                    >
                                        <div
                                            className="relative flex flex-col justify-center"
                                            style={{ marginLeft: `${hubSize / 2}px`, height: '0px' }}
                                        >
                                            {/* RIGHT-SIDE DRIVING */}

                                            {/* Ingress Section (Above centerline) */}
                                            <div className="absolute bottom-[0px] w-full flex flex-col-reverse items-start" style={{ paddingBottom: `${medianPadding + medianHeight / 2}px`, gap: `${laneGap}px` }}>
                                                {arm.ingressLanes.map((lane, idx) => (
                                                    <div
                                                        key={lane.id}
                                                        className="w-full bg-gradient-to-r from-emerald-950/80 to-transparent relative border-l-[6px] border-emerald-500"
                                                        style={{
                                                            height: `${laneHeight}px`
                                                        }}
                                                    >
                                                        <div className="absolute left-0 h-full w-1 bg-white shadow-[0_0_8px_white]" />

                                                        {/* MOVEMENT ARROWS - Stacked away from the stop line but closer to the numbers */}
                                                        <div className="absolute left-[96px] top-1/2 -translate-y-1/2 flex flex-row gap-6">
                                                            {lane.movements.includes('S') && <ArrowUp size={32} className="text-emerald-400 opacity-90 -rotate-90" />}
                                                            {lane.movements.includes('L') && <ArrowUpLeft size={32} className="text-emerald-400 opacity-90 -rotate-90" />}
                                                            {lane.movements.includes('R') && <ArrowUpRight size={32} className="text-emerald-400 opacity-90 -rotate-90" />}
                                                        </div>

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

                                            {/* Egress Section (Below centerline) */}
                                            <div className="absolute top-[0px] w-full flex flex-col items-start" style={{ paddingTop: `${medianPadding + medianHeight / 2}px`, gap: `${laneGap}px` }}>
                                                {/* Direction Label (Street Name) */}
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

                                                {arm.egressLanes.map((lane, idx) => (
                                                    <div
                                                        key={lane.id}
                                                        className="w-full bg-gradient-to-r from-amber-950/80 to-transparent relative border-l-[6px] border-amber-600/70"
                                                        style={{
                                                            height: `${laneHeight}px`
                                                        }}
                                                    >
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
                            })}
                        </div>
                    </div>
                </div>

                    {/* FLOATING LEGEND & FLOW PANEL */}
                    <div 
                        className={`absolute z-30 flex gap-4 p-6 transition-all duration-500 overflow-visible`}
                        style={{
                            flexDirection: (legendPosition.endsWith('right') && flowPanelPosition.endsWith('right')) || (legendPosition.endsWith('left') && flowPanelPosition.endsWith('left')) ? 'row' : 'column',
                            alignItems: (legendPosition.endsWith('right') && flowPanelPosition.endsWith('right')) ? 'flex-end' : (legendPosition.endsWith('left') && flowPanelPosition.endsWith('left') ? 'flex-start' : 'stretch'),
                            top: legendPosition.startsWith('top') || flowPanelPosition.startsWith('top') ? '1.5rem' : 'auto',
                            bottom: legendPosition.startsWith('bottom') || flowPanelPosition.startsWith('bottom') ? '1.5rem' : 'auto',
                            left: legendPosition.endsWith('left') || flowPanelPosition.endsWith('left') ? '1.5rem' : 'auto',
                            right: legendPosition.endsWith('right') || flowPanelPosition.endsWith('right') ? '1.5rem' : 'auto',
                            pointerEvents: 'none'
                        }}
                    >
                        {/* Legend */}
                        {showLegend && (
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
                                <h4 className="text-[8px] font-black text-neutral-500 uppercase tracking-widest mb-1">Destinations</h4>
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
                        )}

                        {/* Flow Panel Overlay */}
                        {showFlowPanel && (
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
                                        <h3 className="text-[8px] font-black text-neutral-500 uppercase tracking-widest">Conservation of Flow</h3>
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
                                            <span className="text-[7px] font-black text-neutral-500 uppercase block mb-1">Inbound</span>
                                            <div className="text-sm font-mono text-emerald-400 font-bold">{totalIngress}</div>
                                        </div>
                                        <div className="bg-white/5 p-2 rounded-lg border border-white/5">
                                            <span className="text-[7px] font-black text-neutral-500 uppercase block mb-1">Outbound</span>
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
                        )}
                    </div>
                </main>

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
                                        { id: 1, label: 'RECT' },
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
                                        <div className="flex justify-between items-center">
                                            <span className="text-xs text-neutral-300">Hub Overlap</span>
                                            <span className="text-[10px] font-mono text-blue-400">{hubOverlap}px</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="150" step="5" value={hubOverlap}
                                            onChange={(e) => setHubOverlap(parseInt(e.target.value))}
                                            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                        <div className="flex justify-between items-center mt-4">
                                            <span className="text-xs text-neutral-300">Mouth Width</span>
                                            <span className="text-[10px] font-mono text-blue-400">+{hubWidthOffset}px</span>
                                        </div>
                                        <input
                                            type="range" min="0" max="150" step="5" value={hubWidthOffset}
                                            onChange={(e) => setHubWidthOffset(parseInt(e.target.value))}
                                            className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                        />
                                    </div>
                                )}
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-300">Central Ribbons</span>
                                <button
                                    onClick={() => setShowInternalRibbons(!showInternalRibbons)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${showInternalRibbons ? 'bg-blue-600' : 'bg-neutral-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showInternalRibbons ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="flex items-center justify-between">
                                <span className="text-xs text-neutral-300">Show Legend</span>
                                <button
                                    onClick={() => setShowLegend(!showLegend)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${showLegend ? 'bg-blue-600' : 'bg-neutral-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showLegend ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

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
                                <div className="flex items-center justify-between">
                                    <span className="text-xs text-neutral-300">Flow Panel</span>
                                    <button
                                        onClick={() => setShowFlowPanel(!showFlowPanel)}
                                        className={`w-10 h-5 rounded-full relative transition-colors ${showFlowPanel ? 'bg-blue-600' : 'bg-neutral-700'}`}
                                    >
                                        <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${showFlowPanel ? 'left-6' : 'left-1'}`} />
                                    </button>
                                </div>
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

                            <div className="flex items-center justify-between">
                                <div className="flex flex-col">
                                    <span className="text-xs text-neutral-300">Fixed Width</span>
                                    <span className="text-[9px] text-neutral-500 italic">Lane scale</span>
                                </div>
                                <button
                                    onClick={() => setUseFixedRibbonWidth(!useFixedRibbonWidth)}
                                    className={`w-10 h-5 rounded-full relative transition-colors ${useFixedRibbonWidth ? 'bg-blue-600' : 'bg-neutral-700'}`}
                                >
                                    <div className={`absolute top-1 w-3 h-3 bg-white rounded-full transition-all ${useFixedRibbonWidth ? 'left-6' : 'left-1'}`} />
                                </button>
                            </div>

                            <div className="space-y-3 pt-2">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-neutral-300">Overlap Length</span>
                                    <span className="text-[10px] font-mono text-blue-400">{ribbonOverlap}px</span>
                                </div>
                                <input
                                    type="range" min="-30" max="30" step="1" value={ribbonOverlap}
                                    onChange={(e) => setRibbonOverlap(parseInt(e.target.value))}
                                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>

                            <div className="space-y-3 pt-4 border-t border-white/5">
                                <div className="flex justify-between items-center">
                                    <span className="text-xs text-neutral-300">Label Offset</span>
                                    <span className="text-[10px] font-mono text-blue-400">{labelHorizontalOffset}px</span>
                                </div>
                                <input
                                    type="range" min="0" max="300" step="1" value={labelHorizontalOffset}
                                    onChange={(e) => setLabelHorizontalOffset(parseInt(e.target.value))}
                                    className="w-full h-1 bg-neutral-700 rounded-lg appearance-none cursor-pointer accent-blue-500"
                                />
                            </div>
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
            </div>
        </div>
    );
};

export default App;