import { useCallback } from 'react';

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
    showMap,
    canvasBg,
    showInternalRibbons,
    useFixedRibbonWidth,
    labelHorizontalOffset,
    setArms,
    setType,
    setGlobalRotation,
    setHubMode,
    setRibbonOverlap,
    setHubOverlap,
    setHubWidthOffset,
    setShowLegend,
    setLegendPosition,
    setShowMap,
    setCanvasBg,
    setShowInternalRibbons,
    setUseFixedRibbonWidth,
    setLabelHorizontalOffset
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
    }, [
        arms, type, globalRotation, hubMode, ribbonOverlap, hubOverlap,
        hubWidthOffset, showLegend, legendPosition, showMap, canvasBg,
        showInternalRibbons, useFixedRibbonWidth, labelHorizontalOffset
    ]);

    const handleImport = useCallback((event) => {
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
    }, [
        setArms, setType, setGlobalRotation, setHubMode, setRibbonOverlap,
        setHubOverlap, setHubWidthOffset, setShowLegend, setLegendPosition,
        setShowMap, setCanvasBg, setShowInternalRibbons, setUseFixedRibbonWidth,
        setLabelHorizontalOffset
    ]);

    return { handleExport, handleImport };
};
