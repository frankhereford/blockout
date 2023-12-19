import { useState, useEffect, use } from 'react';
import Well from "./Well";
import { Camera } from './Camera';
import { Lighting } from "./Lighting";
import { AxesLabels } from "./AxesLabels";
import { GroundPlane } from "./GroundPlane";
import { Piece } from './Piece';
import { Vector3 } from "three";
import { usePieceStore } from "../stores/Piece"; //
import type { PieceType } from './pieces';

interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

export const Scene = ({ width, height, depth }: SceneProps) => {
    const [location, setLocation] = useState(new Vector3(0, 0, 0));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));
    const [pieceName, setPieceName] = useState<PieceType>('tee');

    const setPieceStoreName = usePieceStore((state) => state.setPieceStoreName); // get setPieceStoreName from store
    const setLocationStore = usePieceStore((state) => state.setLocationStore); // get setLocationStore from store
    const setRotationStore = usePieceStore((state) => state.setRotationStore); // get setRotationStore from store
    const cubesStore = usePieceStore((state) => state.cubesStore); 
    const locationStore = usePieceStore((state) => state.locationStore);


    const updateLocation = (newLocation: Vector3) => {
        setPieceStoreName(pieceName);
        setLocationStore(newLocation);
        setRotationStore(rotation);
    };

    useEffect(() => {
        console.log(cubesStore);
        const allCubesInWell = cubesStore.every(cube =>
            cube.x >= 0 && cube.x < width &&
            cube.y >= 0 && cube.y < height &&
            cube.z >= 0 && cube.z < depth
        );
        if (allCubesInWell) {
            setLocation(locationStore);
        }
    }, [cubesStore]);


    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            let newLocation: Vector3;
            switch (event.code) {
                case 'ArrowUp':
                    newLocation = new Vector3(location.x, location.y, location.z - 1);
                    break;
                case 'ArrowDown':
                    newLocation = new Vector3(location.x, location.y, location.z + 1);
                    break;
                case 'ArrowLeft':
                    newLocation = new Vector3(location.x - 1, location.y, location.z);
                    break;
                case 'ArrowRight':
                    newLocation = new Vector3(location.x + 1, location.y, location.z);
                    break;
                case 'PageUp':
                    newLocation = new Vector3(location.x, location.y + 1, location.z);
                    break;
                case 'PageDown':
                    newLocation = new Vector3(location.x, location.y - 1, location.z);
                    break;
                default:
                    return;
            }
            updateLocation(newLocation);
        };

        window.addEventListener('keydown', handleKeyPress);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [location]);


    return (
        <>
            <Camera width={width} height={height} depth={depth} />
            <Well width={width} height={height} depth={depth} />
            <AxesLabels width={width} height={height} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
            <GroundPlane width={width} depth={depth} scaleFactor={20} />
            <Piece piece={pieceName} location={location} rotation={rotation} />
        </>
    );
};
