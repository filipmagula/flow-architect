export const getReadableFlip = (armTotalAngle, globalRotation) => {
    let angle = (globalRotation + armTotalAngle) % 360;
    if (angle < 0) angle += 360;
    if (angle > 135 && angle <= 315) {
        return 180;
    }
    return 0;
};

export const calculateHubSize = (arms, laneHeight, laneGap, medianHeight, medianPadding) => {
    const maxLanesPerArm = Math.max(...arms.map(a => a.ingressLanes.length + a.egressLanes.length));
    const maxRoadWidth = maxLanesPerArm * (laneHeight + laneGap) + (medianHeight + medianPadding * 2);
    return Math.max(500, maxRoadWidth + 180);
};
