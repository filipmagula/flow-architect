import { useMemo } from 'react';
import { BRANCH_COLORS } from '../constants';

export const useCanvasLogic = ({
    arms,
    hubSize,
    ribbonOverlap,
    hubMode,
    laneHeight,
    laneGap,
    medianPadding,
    medianHeight,
    hubOverlap,
    hubWidthOffset
}) => {
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
                            id: `${sourceArm.id}-${lane.id}-${move}-${sourceArm.angle}-${targetArm.angle}`,
                            d: `M ${start.x} ${start.y} L ${startOff.x} ${startOff.y} C ${cp1.x} ${cp1.y}, ${cp2.x} ${cp2.y}, ${endOff.x} ${endOff.y} L ${end.x} ${end.y}`,
                            volume: lane.volume,
                            color: BRANCH_COLORS[targetArm.baseAngle] || '#94a3b8'
                        });
                    }
                });
            });
        });

        return paths;
    }, [arms, hubSize, ribbonOverlap, laneHeight, laneGap, medianPadding, medianHeight]);

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

            points.push({
                x: r * sinA - ingressWidth * cosA,
                y: -r * cosA - ingressWidth * sinA
            });
            points.push({
                x: (r + hubOverlap) * sinA - ingressWidth * cosA,
                y: -(r + hubOverlap) * cosA - ingressWidth * sinA
            });
            points.push({
                x: (r + hubOverlap) * sinA + egressWidth * cosA,
                y: -(r + hubOverlap) * cosA + egressWidth * sinA
            });
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
        if (hubMode !== 2 && hubMode !== 0) return "";
        const r = hubSize / 2;
        const points = [];
        const sortedArms = [...arms].sort((a, b) => (a.baseAngle + a.angle) - (b.baseAngle + b.angle));

        sortedArms.forEach(arm => {
            const angleRad = ((arm.baseAngle + arm.angle) * Math.PI) / 180;
            const ingressWidth = (arm.ingressLanes.length * (laneHeight + laneGap)) + medianPadding + medianHeight / 2 + hubWidthOffset;
            const egressWidth = (arm.egressLanes.length * (laneHeight + laneGap)) + medianPadding + medianHeight / 2 + hubWidthOffset;

            const sinA = Math.sin(angleRad);
            const cosA = Math.cos(angleRad);

            points.push({
                x: r * sinA - ingressWidth * cosA,
                y: -r * cosA - ingressWidth * sinA
            });
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

    return { internalPaths, dynamicHubPath, hubBoundaryPath };
};
