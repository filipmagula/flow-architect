import React, { useMemo, useEffect, useCallback } from 'react';

// Hooks
import { useIntersectionState } from './hooks/useIntersectionState';
import { useUISettings } from './hooks/useUISettings';
import { useCanvasLogic } from './hooks/useCanvasLogic';
import { usePersistence } from './hooks/usePersistence';

// Components
import Header from './components/Layout/Header';
import SidebarLeft from './components/Layout/SidebarLeft';
import SidebarRight from './components/Layout/SidebarRight';
import MainCanvas from './components/Canvas/MainCanvas';

// Constants & Utilities
import {
    LANE_HEIGHT,
    LANE_GAP,
    MEDIAN_HEIGHT,
    MEDIAN_PADDING,
    HUB_SIZE_BASE
} from './constants';
import { calculateHubSize } from './utils/geoUtils';

const App = () => {
    const {
        type, setType,
        arms, setArms,
        totalIngress, totalEgress, delta, deltaPercent,
        updateArm, addLane, removeLane, updateLane, toggleMovement
    } = useIntersectionState('4-way');

    const ui = useUISettings();

    const hubSize = useMemo(() => 
        calculateHubSize(arms, LANE_HEIGHT, LANE_GAP, MEDIAN_HEIGHT, MEDIAN_PADDING)
    , [arms]);

    const canvasLogic = useCanvasLogic({
        arms,
        hubSize,
        ribbonOverlap: ui.ribbonOverlap,
        hubMode: ui.hubMode,
        laneHeight: LANE_HEIGHT,
        laneGap: LANE_GAP,
        medianPadding: MEDIAN_PADDING,
        medianHeight: MEDIAN_HEIGHT,
        hubOverlap: ui.hubOverlap,
        hubWidthOffset: ui.hubWidthOffset
    });

    const { handleExport, handleImport } = usePersistence({
        arms, type, globalRotation: ui.globalRotation, hubMode: ui.hubMode,
        ribbonOverlap: ui.ribbonOverlap, hubOverlap: ui.hubOverlap,
        hubWidthOffset: ui.hubWidthOffset, showLegend: ui.showLegend,
        legendPosition: ui.legendPosition, showMap: ui.showMap,
        canvasBg: ui.canvasBg, showInternalRibbons: ui.showInternalRibbons,
        useFixedRibbonWidth: ui.useFixedRibbonWidth,
        labelHorizontalOffset: ui.labelHorizontalOffset,
        setArms, setType, setGlobalRotation: ui.setGlobalRotation,
        setHubMode: ui.setHubMode, setRibbonOverlap: ui.setRibbonOverlap,
        setHubOverlap: ui.setHubOverlap, setHubWidthOffset: ui.setHubWidthOffset,
        setShowLegend: ui.setShowLegend, setLegendPosition: ui.setLegendPosition,
        setShowMap: ui.setShowMap, setCanvasBg: ui.setCanvasBg,
        setShowInternalRibbons: ui.setShowInternalRibbons,
        setUseFixedRibbonWidth: ui.setUseFixedRibbonWidth,
        setLabelHorizontalOffset: ui.setLabelHorizontalOffset
    });

    const getStatusColor = useCallback(() => {
        if (Math.abs(delta) === 0) return 'text-emerald-400';
        if (deltaPercent < 5) return 'text-amber-400';
        return 'text-rose-400';
    }, [delta, deltaPercent]);

    // Initial Auto Fit
    useEffect(() => {
        ui.handleAutoFit(hubSize, arms);
    }, []);

    return (
        <div className={`flex flex-col h-screen ${ui.canvasBg} text-neutral-100 font-sans overflow-hidden transition-colors duration-500`}>
            <Header
                showSidebar={ui.showSidebar}
                setShowSidebar={ui.setShowSidebar}
                globalRotation={ui.globalRotation}
                setGlobalRotation={ui.setGlobalRotation}
                handleExport={handleExport}
                handleImport={handleImport}
                showMap={ui.showMap}
                setShowMap={ui.setShowMap}
                showDebugSidebar={ui.showDebugSidebar}
                setShowDebugSidebar={ui.setShowDebugSidebar}
            />

            <div className="flex flex-1 overflow-hidden relative">
                <SidebarLeft
                    showSidebar={ui.showSidebar}
                    arms={arms}
                    updateArm={updateArm}
                    addLane={addLane}
                    removeLane={removeLane}
                    updateLane={updateLane}
                    toggleMovement={toggleMovement}
                />

                <MainCanvas
                    mainCanvasRef={ui.mainCanvasRef}
                    showMap={ui.showMap}
                    zoom={ui.zoom}
                    handleZoomIn={ui.handleZoomIn}
                    handleZoomOut={ui.handleZoomOut}
                    handleAutoFit={() => ui.handleAutoFit(hubSize, arms)}
                    globalRotation={ui.globalRotation}
                    hubSize={hubSize}
                    hubMode={ui.hubMode}
                    dynamicHubPath={canvasLogic.dynamicHubPath}
                    showInternalRibbons={ui.showInternalRibbons}
                    hubBoundaryPath={canvasLogic.hubBoundaryPath}
                    internalPaths={canvasLogic.internalPaths}
                    useFixedRibbonWidth={ui.useFixedRibbonWidth}
                    arms={arms}
                    medianPadding={MEDIAN_PADDING}
                    medianHeight={MEDIAN_HEIGHT}
                    laneGap={LANE_GAP}
                    laneHeight={LANE_HEIGHT}
                    labelHorizontalOffset={ui.labelHorizontalOffset}
                    editingLaneId={ui.editingLaneId}
                    setEditingLaneId={ui.setEditingLaneId}
                    editingArmId={ui.editingArmId}
                    setEditingArmId={ui.setEditingArmId}
                    updateLane={updateLane}
                    updateArm={updateArm}
                    showLegend={ui.showLegend}
                    legendPosition={ui.legendPosition}
                    flowPanelPosition={ui.flowPanelPosition}
                    showFlowPanel={ui.showFlowPanel}
                    delta={delta}
                    getStatusColor={getStatusColor}
                    totalIngress={totalIngress}
                    totalEgress={totalEgress}
                />

                <SidebarRight
                    showDebugSidebar={ui.showDebugSidebar}
                    hubMode={ui.hubMode}
                    setHubMode={ui.setHubMode}
                    hubOverlap={ui.hubOverlap}
                    setHubOverlap={ui.setHubOverlap}
                    hubWidthOffset={ui.hubWidthOffset}
                    setHubWidthOffset={ui.setHubWidthOffset}
                    showInternalRibbons={ui.showInternalRibbons}
                    setShowInternalRibbons={ui.setShowInternalRibbons}
                    showLegend={ui.showLegend}
                    setShowLegend={ui.setShowLegend}
                    legendPosition={ui.legendPosition}
                    setLegendPosition={ui.setLegendPosition}
                    showFlowPanel={ui.showFlowPanel}
                    setShowFlowPanel={ui.setShowFlowPanel}
                    flowPanelPosition={ui.flowPanelPosition}
                    setFlowPanelPosition={ui.setFlowPanelPosition}
                    useFixedRibbonWidth={ui.useFixedRibbonWidth}
                    setUseFixedRibbonWidth={ui.setUseFixedRibbonWidth}
                    ribbonOverlap={ui.ribbonOverlap}
                    setRibbonOverlap={ui.setRibbonOverlap}
                    labelHorizontalOffset={ui.labelHorizontalOffset}
                    setLabelHorizontalOffset={ui.setLabelHorizontalOffset}
                    canvasBg={ui.canvasBg}
                    setCanvasBg={ui.setCanvasBg}
                />
            </div>
        </div>
    );
};

export default App;