import { useEffect, useMemo } from 'react';
import { Cube } from './primitives/Cube';
import { pieces } from './data/pieces';
import type { PieceType } from './data/pieces';
import { Vector3, Quaternion } from 'three';
import { useSprings } from '@react-spring/three'
import type { SpringValue } from '@react-spring/three'
import { usePieceStore } from '../stores/Piece';

interface SpringProps {
    location: SpringValue<number[]>;
}

interface PieceProps {
    piece?: PieceType;
    location?: Vector3;
    rotation?: Quaternion;
}

const generateLocations = (piece: PieceType = 'tee', location: Vector3 = new Vector3(0, 0, 0), rotation: Quaternion = new Quaternion()) => {
    const { coordinates, origin } = pieces[piece];
    const locations: Vector3[] = [];

    coordinates.forEach(coordinate => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyQuaternion(rotation);
        offsetCoordinate.add(origin);
        offsetCoordinate.add(location);
        locations.push(offsetCoordinate);
    });

    return locations;
};

export const Piece = ({ piece = 'tee', location = new Vector3(0, 0, 0), rotation = new Quaternion() }: PieceProps) => {
    const { coordinates, color, origin } = pieces[piece];
    const pieceStoreName = usePieceStore((state) => state.pieceStoreName);
    const locationStore = usePieceStore((state) => state.locationStore);
    const rotationStore = usePieceStore((state) => state.rotationStore);
    const setCubesStore = usePieceStore((state) => state.setCubesStore);

    useEffect(() => {
        piece = pieceStoreName as PieceType;
        location = locationStore;
        rotation = rotationStore;
        const locations = generateLocations(piece, location, rotation);
        setCubesStore(locations);
    }, [pieceStoreName, locationStore, rotationStore]);

    const coordinatesWithQuaternionApplied = useMemo(() => coordinates.map(coordinate => {
        const offsetCoordinate = coordinate.clone().sub(origin);
        offsetCoordinate.applyQuaternion(rotation);
        offsetCoordinate.add(origin);
        return offsetCoordinate;
    }), [coordinates, origin, rotation]);

    const springs = useSprings(
        coordinatesWithQuaternionApplied.length,
        coordinatesWithQuaternionApplied.map((coordinate: Vector3) => ({
            location: [coordinate.x + location.x, coordinate.y + location.y, coordinate.z + location.z],
            config: { mass: 1, tension: 170, friction: 26 },
        }))
    );

    return (
                <>
                    {springs.map(({ location }: SpringProps, index: number) => (
                        <Cube key={index} location={location} color={color} />
                    ))}
                </>
            );
        };