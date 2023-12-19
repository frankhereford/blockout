import { useState, useEffect } from 'react';
import Well from "./well/Well";
import { Camera } from './Camera';
import { Lighting } from "./lights/Lighting";
import { AxesLabels } from "./well/AxesLabels";
import { GroundPlane } from "./GroundPlane";
import { Piece } from './Piece';
import { Vector3 } from "three";
import { usePieceStore } from "../stores/Piece"; //
import type { PieceType } from './data/pieces';
import { Pile } from './Pile';

interface SceneProps {
    width: number;
    height: number;
    depth: number;
}

const roundVector3 = (vector: Vector3): Vector3 => {
    return new Vector3(
        Math.round(vector.x),
        Math.round(vector.y),
        Math.round(vector.z)
    );
};

export const Scene = ({ width, height, depth }: SceneProps) => {
    const [location, setLocation] = useState(new Vector3(0, 0, 0));
    const [rotation, setRotation] = useState(new Vector3(0, 0, 0));
    const [pieceName, setPieceName] = useState<PieceType>('tee');

    const setPieceStoreName = usePieceStore((state) => state.setPieceStoreName);
    const setLocationStore = usePieceStore((state) => state.setLocationStore);
    const setRotationStore = usePieceStore((state) => state.setRotationStore);
    const cubesStore = usePieceStore((state) => state.cubesStore); 
    const locationStore = usePieceStore((state) => state.locationStore);
    const rotationStore = usePieceStore((state) => state.rotationStore);

    const initialPile: { location: Vector3, id: string, visible: boolean }[][][] = new Array(width).fill(null).map((_, x) =>
        new Array(height).fill(null).map((_, y) =>
            new Array(depth).fill(null).map((_, z) => ({
                location: new Vector3(x, y, z),
                id: `${x}-${y}-${z}`,
                visible: false,
            }))
        )
    );
    const [pile, setPile] = useState(initialPile);


    const updatePosition = (newLocation: Vector3, newRotation: Vector3) => {
        setPieceStoreName(pieceName);
        setLocationStore(newLocation);
        setRotationStore(newRotation);
    };

    useEffect(() => {
        console.log("new Cubes: ", cubesStore)

        const roundedCubes = cubesStore.map(cube => roundVector3(new Vector3(cube.x, cube.y, cube.z)));

        // Flatten the 3D array into a 1D array
        const flattenedPile = ([] as Cube[]).concat(...pile.map(row => ([] as Cube[]).concat(...row)));

        // Filter the flattened array to only include cubes that are visible
        const visibleCubes = flattenedPile.filter(cube => cube.visible);

        // Check if any cube in cubesStore intersects with any visible cube in the pile
        const intersects = roundedCubes.some(cube1 =>
            visibleCubes.some(cube2 =>
                cube1.x === cube2.location.x &&
                cube1.y === cube2.location.y &&
                cube1.z === cube2.location.z
            )
        );

        // If there's an intersection, return early
        if (intersects) {
            return;
        }



        const allCubesInWell = roundedCubes.every(cube =>
            cube.x >= 0 && cube.x < width &&
            cube.y >= 0 && cube.y < height &&
            cube.z >= 0 && cube.z < depth
        );
        if (allCubesInWell) {
            setLocation(locationStore);
            setRotation(rotationStore);
        }
    }, [cubesStore]);

    useEffect(() => {
        const handleKeyPress = (event: KeyboardEvent) => {
            let newLocation: Vector3 = location;
            let newRotation: Vector3 = rotation;
            let newPile: Pile = pile;
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
                case 'KeyQ':
                    newRotation = new Vector3(rotation.x + 1, rotation.y, rotation.z);
                    break;
                case 'KeyW':
                    newRotation = new Vector3(rotation.x, rotation.y + 1, rotation.z);
                    break;
                case 'KeyE':
                    newRotation = new Vector3(rotation.x, rotation.y, rotation.z + 1);
                    break;
                case 'KeyZ':
                    newPile = makeRandomCubeVisible(pile);
                    setPile(newPile);
                    return;
                case 'KeyX':
                    newPile = makeRandomCubeInvisible(pile);
                    setPile(newPile);
                    return;
                default:
                    return;
            }
            updatePosition(newLocation, newRotation);
        };

        window.addEventListener('keydown', handleKeyPress);

        // Cleanup function to remove the event listener when the component unmounts
        return () => {
            window.removeEventListener('keydown', handleKeyPress);
        };
    }, [location, rotation, pile]);

    type Cube = { location: Vector3, id: string, visible: boolean };
    type Pile = Cube[][][];

    function makeRandomCubeVisible(pile: Pile): Pile {
        const newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        const flattenedCubes = newPile.flat(3);
        const invisibleCubes = flattenedCubes.filter(cube => !cube.visible);
        if (invisibleCubes.length === 0) {
            return pile;
        }
        const randomCube = invisibleCubes[Math.floor(Math.random() * invisibleCubes.length)];
        randomCube!.visible = true;
        return newPile;
    }

    function makeRandomCubeInvisible(pile: Pile): Pile {
        const newPile: Pile = JSON.parse(JSON.stringify(pile)) as Pile;
        const flattenedCubes = newPile.flat(3);
        const visibleCubes = flattenedCubes.filter(cube => cube.visible);
        if (visibleCubes.length === 0) {
            return pile;
        }
        const randomCube = visibleCubes[Math.floor(Math.random() * visibleCubes.length)];
        randomCube!.visible = false;
        return newPile;
    }



    return (
        <>
            <Camera width={width} height={height} depth={depth} />
            <Well width={width} height={height} depth={depth} />
            <AxesLabels width={width} height={height} depth={depth} />
            <Lighting width={width} height={height} depth={depth} />
            <GroundPlane width={width} depth={depth} scaleFactor={20} />
            <Pile cubes={pile} />
            <Piece piece={pieceName} location={location} rotation={rotation} />
        </>
    );
};
