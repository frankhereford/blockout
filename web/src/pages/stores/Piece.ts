// pieceStore.ts
import { create } from 'zustand';
import { Vector3 } from 'three'; // assuming you're using the 'three' library for Vector3

type PieceState = {
    pieceStoreName: string;
    locationStore: Vector3;
    rotationStore: Vector3;
    cubesStore: Vector3[];
    setPieceStoreName: (name: string) => void;
    setLocationStore: (location: Vector3) => void;
    setRotationStore: (rotation: Vector3) => void;
    setCubesStore: (cubes: Vector3[]) => void;
};

export const usePieceStore = create<PieceState>((set) => ({
    pieceStoreName: '', // initial state
    locationStore: new Vector3(), // initial state
    rotationStore: new Vector3(), // initial state
    cubesStore: [], // initial state
    setPieceStoreName: (name) => set({ pieceStoreName: name }),
    setLocationStore: (location) => set({ locationStore: location }), // use 'location' to set 'locationStore'
    setRotationStore: (rotation) => set({ rotationStore: rotation }), // use 'rotation' to set 'rotationStore'
    setCubesStore: (cubes) => set({ cubesStore: cubes }), // use 'cubes' to set 'cubesStore'
}));