import { useState, useCallback, useEffect } from 'react';
import { ReactFlow, applyNodeChanges, applyEdgeChanges, addEdge, Background, MiniMap, Controls, type Edge, type Node, useReactFlow } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import CustomNode from '../CustomNode/CustomNode';
import { Button } from '../ui/button';
import { toast, Toaster } from "sonner"
import dagre from '@dagrejs/dagre';


//Dagre SetUp
const dagreGraph = new dagre.graphlib.Graph().setDefaultEdgeLabel(() => ({}));
const NODE_WIDTH = 150;
const NODE_HEIGHT = 50;


function getLayoutedElements(nodes: Node[], edges: Edge[], direction = 'TB') {
    const isHorizontal = direction === 'LR';
    dagreGraph.setGraph({ rankdir: direction });

    nodes.forEach((node) => {
        dagreGraph.setNode(node.id, { width: NODE_WIDTH, height: NODE_HEIGHT });
    });
    edges.forEach((edge) => {
        dagreGraph.setEdge(edge.source, edge.target);
    });

    dagre.layout(dagreGraph);

    const layoutedNodes = nodes.map((node) => {
        const { x, y } = dagreGraph.node(node.id);
        return {
            ...node,
            position: { x: x - NODE_WIDTH / 2, y: y - NODE_HEIGHT / 2 },
            targetPosition: isHorizontal ? 'left' : 'top',
            sourcePosition: isHorizontal ? 'right' : 'bottom',
        };
    });

    return { nodes: layoutedNodes, edges };
}


const initialNodes: Node[] = [
    {
        id: 'n1',
        type: 'customNode',
        position: { x: 0, y: 0 },
        data: { label: 'Node 1' },
        selected: false
    },
    {
        id: 'n2',
        type: 'customNode',
        position: { x: 0, y: 100 },
        data: { label: 'Node 2' },
        selected: false
    },
];


const initialEdges: Edge[] = [{ id: 'n1-n2', source: 'n1', target: 'n2' }];


export default function FlowWrapper() {

    const [nodes, setNodes] = useState<Node[]>(initialNodes);
    const [edges, setEdges] = useState<Edge[]>(initialEdges);

    const [selectedNodes, setSelectedNodes] = useState<string[]>([]);
    const [selectedEdges, setSelectedEdges] = useState<string[]>([]);

    const [dagStatus, setDagStatus] = useState<string>('✅ DAG is Valid');

    const { fitView } = useReactFlow();


    const onLayout = useCallback((direction = 'TB') => {
        const { nodes: ln, edges: le } = getLayoutedElements(nodes, edges, direction);
        // @ts-ignore
        setNodes([...ln]);
        setEdges([...le]);

        // Auto zoom to fit
        setTimeout(() => fitView({ padding: 0.2, duration: 300 }), 0);
    }, [nodes, edges, fitView]);



    const checkForCycles = (edges: any[]) => {
        const adj: Record<string, string[]> = {};
        edges.forEach((edge) => {
            if (!adj[edge.source]) adj[edge.source] = [];
            adj[edge.source].push(edge.target);
        });

        const visited: Set<string> = new Set();
        const recStack: Set<string> = new Set();

        const dfs = (node: string): boolean => {
            if (recStack.has(node)) return true; // cycle found
            if (visited.has(node)) return false;

            visited.add(node);
            recStack.add(node);

            for (const neighbor of adj[node] || []) {
                if (dfs(neighbor)) return true;
            }

            recStack.delete(node);
            return false;
        };

        for (const node of Object.keys(adj)) {
            if (dfs(node)) return true;
        }
        return false;
    };

    const validateDAG = (edges: any[]) => {
        const hasCycle = checkForCycles(edges);
        setDagStatus(hasCycle ? '❌ Invalid DAG: Cycle detected' : '✅ DAG is valid');
    };



    const onNodesChange = useCallback(
        (changes: any) => {
            setNodes((nds) => applyNodeChanges(changes, nds));

            // 🔹 Update selected nodes state
            changes.forEach((change: any) => {
                if (change.type === 'select') {
                    if (change.selected) {
                        setSelectedNodes((prev) => [...prev, change.id]);
                    } else {
                        setSelectedNodes((prev) => prev.filter((id) => id !== change.id));
                    }
                }
            });
        },
        []
    );

    const onEdgesChange = useCallback(
        (changes: any) => {
            setEdges((eds) => applyEdgeChanges(changes, eds));

            changes.forEach((change: any) => {
                if (change.type === 'select') {
                    if (change.selected) {
                        setSelectedEdges((prev) => [...prev, change.id]);
                    } else {
                        setSelectedEdges((prev) => prev.filter((id) => id !== change.id));
                    }
                }
            });
        },
        []
    );


    const onConnect = useCallback(
        (params: any) => {

            const { source, target } = params;

            if (source === target) {
                toast('Cannot connect a node to itself!');
                return;
            }

            setEdges((eds) => {
                const newEdges = addEdge(params, eds);
                validateDAG(newEdges); // ✅ Re-check DAG after connection
                return newEdges;
            });

        },
        [],
    );

    useEffect(() => {
        validateDAG(edges);
    }, [edges]);


    const addNode = () => {

        const label = prompt("Enter node name:");
        if (!label) return;

        const newNode = {
            id: `${nodes.length + 1}`, // simple ID increment
            type: 'customNode', // ✅ Important
            position: { x: Math.random() * 100, y: Math.random() * 100 }, // random position for now
            data: { label },
            selected: false, // Added to fix the type error
        };

        setNodes((nds) => [...nds, newNode]);
    };

    const nodeTypes = { customNode: CustomNode };

    const deleteNode = () => {
        const selectedNode = nodes.find(node => node.selected);
        if (!selectedNode) {
            toast.error("Please select a node to delete");
            return;
        }

        setNodes((nds) => nds.filter(node => node.id !== selectedNode.id));
        setEdges((eds) => eds.filter(edge =>
            edge.source !== selectedNode.id && edge.target !== selectedNode.id
        ));
    }

    const clearCanvas = () => {
        setNodes([])
        setEdges([])
    }

    useEffect(() => {
        const handleDelete = (event: KeyboardEvent) => {
            if (event.key === 'Delete') {
                setNodes((nds) => nds.filter((node) => !selectedNodes.includes(node.id)));
                setEdges((eds) => {
                    const updatedEdges = eds.filter((edge) => !selectedEdges.includes(edge.id));
                    validateDAG(updatedEdges); // ✅ Re-check DAG after deletion
                    return updatedEdges;
                });

                // Clear selection state after deletion
                setSelectedNodes([]);
                setSelectedEdges([]);
            }
        };

        window.addEventListener('keydown', handleDelete);
        return () => window.removeEventListener('keydown', handleDelete);
    }, [selectedNodes, selectedEdges]);



    return (
        <main className="h-screen bg-gradient-to-br  from-gray-900 to-black  relative overflow-y-auto">
            <Toaster
                position="top-right"
                richColors
                closeButton
            />


            <div className='bg-gradient-to-br z-99 mt-5 w-full from-black-900 p-3 sm:p-5 flex  sm:flex-row justify-center items-center gap-4 sm:gap-10 rounded-lg shadow-xl border overflow-hidden border-gray-700/50 mb-4 absolute inset-x-0  sm:w-full lg:w-full flex-wrap mx-auto'>
                <Button
                    onClick={addNode}
                    className='w-30 sm:w-auto bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-ease-in-out transform hover:scale-105 shadow-md cursor-pointer duration-500'
                >
                    Add Node
                </Button>
                <Button
                    onClick={deleteNode}
                    className='w-30 sm:w-auto bg-red-600 hover:bg-red-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-ease-in-out transform hover:scale-105 shadow-md cursor-pointer duration-500'
                >
                    Delete Node
                </Button>

                <Button
                    onClick={clearCanvas}
                    className='w-30 sm:w-auto bg-pink-600 hover:bg-pink-700 text-white font-semibold px-4 sm:px-6 py-2 rounded-lg transition-ease-in-out transform hover:scale-105 shadow-md cursor-pointer duration-500'
                >
                    Clear Canvas
                </Button>


                <Button onClick={() => onLayout('TB')} className='bg-green-600 text-white'>Auto Layout Vertical</Button>
                <Button onClick={() => onLayout('LR')} className='bg-green-600 text-white'>Auto Layout Horizontal</Button>

                {/* DAG Status */}
                <div className="bg-neutral-300 lg:w-fit sm:px-4 p-1  font-normal text-lg  rounded-xl">
                    <span>{dagStatus}</span>
                </div>

            </div>

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                nodeTypes={nodeTypes}
                defaultEdgeOptions={{
                    style: { strokeWidth: 2, stroke: "#64748b" },
                    type: "simplebezier",
                }}
                fitView
                className="bg-gray-100 dark:bg-gray-900 rounded-2xl overflow-hidden shadow-2xl"
            >
                <Controls className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg" />
                <MiniMap
                    className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 shadow-lg rounded-lg"
                    nodeColor="#3b82f6"
                    maskColor="rgba(0, 0, 0, 0.1)"
                />
                <Background color="#e2e8f0" gap={20} size={1} className="dark:opacity-20" />
            </ReactFlow>
        </main>
    );
}