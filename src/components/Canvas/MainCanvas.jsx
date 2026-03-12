import React from 'react';
import ZoomControls from '../Overlays/ZoomControls';
import JunctionHub from './JunctionHub';
import IntersectionArm from './IntersectionArm';
import Legend from '../Overlays/Legend';
import FlowPanel from '../Overlays/FlowPanel';
import { BRANCH_COLORS } from '../../constants';

const MainCanvas = (props) => {
    const {
        mainCanvasRef,
        showMap,
        zoom,
        handleZoomIn,
        handleZoomOut,
        handleAutoFit,
        globalRotation,
        hubSize,
        hubMode,
        dynamicHubPath,
        showInternalRibbons,
        hubBoundaryPath,
        internalPaths,
        useFixedRibbonWidth,
        arms,
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
        showLegend,
        legendPosition,
        flowPanelPosition,
        showFlowPanel,
        delta,
        getStatusColor,
        totalIngress,
        totalEgress
    } = props;

    return (
        <main ref={mainCanvasRef} className="flex-1 relative overflow-hidden flex flex-col transition-colors duration-500">
            <div className="flex-1 relative flex items-center justify-center overflow-hidden">
                <ZoomControls
                    handleZoomIn={handleZoomIn}
                    handleZoomOut={handleZoomOut}
                    handleAutoFit={handleAutoFit}
                    zoom={zoom}
                />

                <div
                    className="relative flex items-center justify-center transition-transform duration-300 ease-out"
                    style={{ transform: `scale(${zoom})` }}
                >
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

                    <div
                        className="relative z-30 transition-all duration-500 ease-in-out flex items-center justify-center overflow-visible"
                        style={{
                            width: `${hubSize}px`,
                            height: `${hubSize}px`,
                            transform: `rotate(${globalRotation}deg)`
                        }}
                    >
                        <JunctionHub
                            hubSize={hubSize}
                            hubMode={hubMode}
                            dynamicHubPath={dynamicHubPath}
                            showInternalRibbons={showInternalRibbons}
                            hubBoundaryPath={hubBoundaryPath}
                            internalPaths={internalPaths}
                            useFixedRibbonWidth={useFixedRibbonWidth}
                        />

                        {arms.map((arm) => (
                            <IntersectionArm
                                key={arm.id}
                                arm={arm}
                                hubSize={hubSize}
                                globalRotation={globalRotation}
                                medianPadding={medianPadding}
                                medianHeight={medianHeight}
                                laneGap={laneGap}
                                laneHeight={laneHeight}
                                labelHorizontalOffset={labelHorizontalOffset}
                                editingLaneId={editingLaneId}
                                setEditingLaneId={setEditingLaneId}
                                editingArmId={editingArmId}
                                setEditingArmId={setEditingArmId}
                                updateLane={updateLane}
                                updateArm={updateArm}
                            />
                        ))}
                    </div>
                </div>
            </div>

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
                <Legend
                    arms={arms}
                    showLegend={showLegend}
                    legendPosition={legendPosition}
                    flowPanelPosition={flowPanelPosition}
                    BRANCH_COLORS={BRANCH_COLORS}
                />

                <FlowPanel
                    showFlowPanel={showFlowPanel}
                    flowPanelPosition={flowPanelPosition}
                    legendPosition={legendPosition}
                    delta={delta}
                    getStatusColor={getStatusColor}
                    totalIngress={totalIngress}
                    totalEgress={totalEgress}
                />
            </div>
        </main>
    );
};

export default MainCanvas;
