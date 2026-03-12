import { useCallback } from 'react';

const sanitizeConfig = (config) => {
    const sanitized = { ...config };

    if (sanitized.arms) {
        sanitized.arms = sanitized.arms.map(arm => ({
            ...arm,
            label: arm.label ?? '',
            angle: arm.angle ?? 0,
            ingressLanes: (arm.ingressLanes || []).map(lane => ({
                ...lane,
                name: lane.name ?? '',
                volume: lane.volume ?? 0,
                movements: lane.movements ?? []
            })),
            egressLanes: (arm.egressLanes || []).map(lane => ({
                ...lane,
                name: lane.name ?? '',
                volume: lane.volume ?? 0
            }))
        }));
    }

    return sanitized;
};

export const usePersistence = ({
    arms,
    type,
    globalRotation,
    hubMode,
    ribbonOverlap,
    hubOverlap,
    hubWidthOffset,
    showLegend,
    legendPosition,

    canvasBg,
    showInternalRibbons,
    useFixedRibbonWidth,
    labelHorizontalOffset,
    canvasViewMode,
    setArms,
    setType,
    setGlobalRotation,
    setHubMode,
    setRibbonOverlap,
    setHubOverlap,
    setHubWidthOffset,
    setShowLegend,
    setLegendPosition,

    setCanvasBg,
    setShowInternalRibbons,
    setUseFixedRibbonWidth,
    setLabelHorizontalOffset,
    setCanvasViewMode
}) => {
    const handleExport = useCallback(() => {
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

            canvasBg,
            showInternalRibbons,
            useFixedRibbonWidth,
            labelHorizontalOffset,
            canvasViewMode,
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
    }, [
        arms, type, globalRotation, hubMode, ribbonOverlap, hubOverlap,
        hubWidthOffset, showLegend, legendPosition, canvasBg,
        showInternalRibbons, useFixedRibbonWidth, labelHorizontalOffset, canvasViewMode
    ]);

    const handleImport = useCallback((event) => {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const rawConfig = JSON.parse(e.target.result);
                const config = sanitizeConfig(rawConfig);

                if (config.arms) setArms(config.arms);
                if (config.type !== undefined) setType(config.type);
                if (config.globalRotation !== undefined) setGlobalRotation(config.globalRotation);
                if (config.hubMode !== undefined) setHubMode(config.hubMode);
                if (config.ribbonOverlap !== undefined) setRibbonOverlap(config.ribbonOverlap);
                if (config.hubOverlap !== undefined) setHubOverlap(config.hubOverlap);
                if (config.hubWidthOffset !== undefined) setHubWidthOffset(config.hubWidthOffset);
                if (config.showLegend !== undefined) setShowLegend(config.showLegend);
                if (config.legendPosition !== undefined) setLegendPosition(config.legendPosition);

                if (config.canvasBg !== undefined) setCanvasBg(config.canvasBg);
                if (config.showInternalRibbons !== undefined) setShowInternalRibbons(config.showInternalRibbons);
                if (config.useFixedRibbonWidth !== undefined) setUseFixedRibbonWidth(config.useFixedRibbonWidth);
                if (config.labelHorizontalOffset !== undefined) setLabelHorizontalOffset(config.labelHorizontalOffset);
                if (config.canvasViewMode !== undefined) setCanvasViewMode(config.canvasViewMode);
            } catch (err) {
                console.error("Failed to import configuration:", err);
                alert("Invalid configuration file.");
            }
        };
        reader.readAsText(file);
    }, [
        setArms, setType, setGlobalRotation, setHubMode, setRibbonOverlap,
        setHubOverlap, setHubWidthOffset, setShowLegend, setLegendPosition,
        setCanvasBg, setShowInternalRibbons, setUseFixedRibbonWidth,
        setLabelHorizontalOffset, setCanvasViewMode
    ]);

    return { handleExport, handleImport };
};
