import { Text, Billboard } from "@react-three/drei";

interface AxesLabelsProps {
    width: number;
    height: number;
    depth: number;
}

export default function AxesLabels({ width, height, depth }: AxesLabelsProps) {
    return (
        <>
            <Billboard position={[width + 1, 0, 0]}>
                <Text fontSize={1} color="red">
                    X
                </Text>
            </Billboard>
            <Billboard position={[0, height + 1, 0]}>
                <Text fontSize={1} color="green">
                    Y
                </Text>
            </Billboard>
            <Billboard position={[0, 0, depth + 1]}>
                <Text fontSize={1} color="blue">
                    Z
                </Text>
            </Billboard>
            <Billboard position={[-0.5, 0, -0.5]}>
                <Text fontSize={1} color="white">
                    O
                </Text>
            </Billboard>
        </>
    );
}
