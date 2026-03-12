import { useState, useCallback, useRef, useEffect } from 'react';

export const useUISettings = () => {
    const [showMap, setShowMap] = useState(true);
    const [showSidebar, setShowSidebar] = useState(false);
    const [showDebugSidebar, setShowDebugSidebar] = useState(false);
    const [showFlowPanel, setShowFlowPanel] = useState(true);
    const [flowPanelPosition, setFlowPanelPosition] = useState('bottom-right');
    const [globalRotation, setGlobalRotation] = useState(0);
    const [editingArmId, setEditingArmId] = useState(null);
    const [editingLaneId, setEditingLaneId] = useState(null);
    const [zoom, setZoom] = useState(1);
    const [hubMode, setHubMode] = useState(2); // 0: None, 1: Rect, 2: Adaptive
    const [showInternalRibbons, setShowInternalRibbons] = useState(true);
    const [showLegend, setShowLegend] = useState(true);
    const [legendPosition, setLegendPosition] = useState('bottom-right');
    const [useFixedRibbonWidth, setUseFixedRibbonWidth] = useState(false);
    const [ribbonOverlap, setRibbonOverlap] = useState(-30);
    const [hubOverlap, setHubOverlap] = useState(100);
    const [hubWidthOffset, setHubWidthOffset] = useState(35);
    const [canvasBg, setCanvasBg] = useState('bg-[#1e293b]');
    const [labelHorizontalOffset, setLabelHorizontalOffset] = useState(111);

    const mainCanvasRef = useRef(null);

    const handleZoomIn = useCallback(() => setZoom(prev => Math.min(prev + 0.1, 3)), []);
    const handleZoomOut = useCallback(() => setZoom(prev => Math.max(prev - 0.1, 0.1)), []);

    const handleAutoFit = useCallback((hubSize, arms) => {
        if (!mainCanvasRef.current) return;
        
        const canvasWidth = mainCanvasRef.current.clientWidth;
        const canvasHeight = mainCanvasRef.current.clientHeight;
        
        let minX = -hubSize / 2;
        let maxX = hubSize / 2;
        let minY = -hubSize / 2;
        let maxY = hubSize / 2;

        const buffer = 150; 
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
    }, [globalRotation, labelHorizontalOffset]);

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

    return {
        showMap, setShowMap,
        showSidebar, setShowSidebar,
        showDebugSidebar, setShowDebugSidebar,
        showFlowPanel, setShowFlowPanel,
        flowPanelPosition, setFlowPanelPosition,
        globalRotation, setGlobalRotation,
        editingArmId, setEditingArmId,
        editingLaneId, setEditingLaneId,
        zoom, setZoom,
        hubMode, setHubMode,
        showInternalRibbons, setShowInternalRibbons,
        showLegend, setShowLegend,
        legendPosition, setLegendPosition,
        useFixedRibbonWidth, setUseFixedRibbonWidth,
        ribbonOverlap, setRibbonOverlap,
        hubOverlap, setHubOverlap,
        hubWidthOffset, setHubWidthOffset,
        canvasBg, setCanvasBg,
        labelHorizontalOffset, setLabelHorizontalOffset,
        mainCanvasRef,
        handleZoomIn, handleZoomOut, handleAutoFit
    };
};
