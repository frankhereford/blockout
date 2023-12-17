import React from 'react';
import Cylinder from "./Cylinder";

interface Vector3 {
    x: number;
    y: number;
    z: number;
}

interface GridPlaneProps {
    lowerLeft: Vector3;
    upperRight: Vector3;
}

const GridPlane: React.FC<GridPlaneProps> = ({ lowerLeft, upperRight }) => {
    const cylinders = [];
    const width = 0.02; // Set the width of the cylinders

    let plane = '';
    let spanX = 0;
    let spanY = 0;

    if (lowerLeft.x === upperRight.x) {
        plane = 'YZ';
        spanX = upperRight.y - lowerLeft.y;
        spanY = upperRight.z - lowerLeft.z;
    } else if (lowerLeft.y === upperRight.y) {
        plane = 'XZ';
        spanX = upperRight.x - lowerLeft.x;
        spanY = upperRight.z - lowerLeft.z;
    } else if (lowerLeft.z === upperRight.z) {
        plane = 'XY';
        spanX = upperRight.x - lowerLeft.x;
        spanY = upperRight.y - lowerLeft.y;
    }

    // Draw lines in one direction
    for (let i = 0; i <= spanX; i++) {
        for (let j = 0; j < spanY; j++) {
            let point1, point2;
            if (plane === 'YZ') {
                point1 = [lowerLeft.x, lowerLeft.y + i, lowerLeft.z + j];
                point2 = [lowerLeft.x, lowerLeft.y + i, lowerLeft.z + j + 1];
            } else if (plane === 'XZ') {
                point1 = [lowerLeft.x + i, lowerLeft.y, lowerLeft.z + j];
                point2 = [lowerLeft.x + i, lowerLeft.y, lowerLeft.z + j + 1];
            } else if (plane === 'XY') {
                point1 = [lowerLeft.x + i, lowerLeft.y + j, lowerLeft.z];
                point2 = [lowerLeft.x + i, lowerLeft.y + j + 1, lowerLeft.z];
            }
            if (point1 && point2) {
                cylinders.push(<Cylinder point1={point1 as [number, number, number]} point2={point2 as [number, number, number]} width={width} key={`line1_${i}_${j}`} />);
            }
        }
    }

    // Draw lines in the other direction
    for (let i = 0; i <= spanY; i++) {
        for (let j = 0; j < spanX; j++) {
            let point1, point2;
            if (plane === 'YZ') {
                point1 = [lowerLeft.x, lowerLeft.y + j, lowerLeft.z + i];
                point2 = [lowerLeft.x, lowerLeft.y + j + 1, lowerLeft.z + i];
            } else if (plane === 'XZ') {
                point1 = [lowerLeft.x + j, lowerLeft.y, lowerLeft.z + i];
                point2 = [lowerLeft.x + j + 1, lowerLeft.y, lowerLeft.z + i];
            } else if (plane === 'XY') {
                point1 = [lowerLeft.x + j, lowerLeft.y + i, lowerLeft.z];
                point2 = [lowerLeft.x + j + 1, lowerLeft.y + i, lowerLeft.z];
            }
            if (point1 && point2) {
                cylinders.push(<Cylinder point1={point1 as [number, number, number]} point2={point2 as [number, number, number]} width={width} key={`line2_${i}_${j}`} />);
            }
        }
    }

    return <>{cylinders}</>;
};

export default GridPlane;