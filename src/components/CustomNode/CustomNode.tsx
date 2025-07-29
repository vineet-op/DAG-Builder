import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data, selected }: any) {
    return (
        <div className={`
            p-2.5 
            ${selected ? 'border-2 border-red-500 bg-red-50 shadow-[0_0_8px_rgba(255,68,68,0.3)]' : 'border border-gray-300 bg-white'}
            rounded-lg 
            text-center 
            min-w-[100px]
        `}>
            {/* 🔵 Incoming Handle (Left side) */}
            <Handle
                type="target"
                position={Position.Left}
                className="bg-gray-500"
                onConnect={(params) => console.log('Incoming connection', params)}
            />

            {/* Node label */}
            <div>{data.label}</div>

            {/* 🔴 Outgoing Handle (Right side) */}
            <Handle
                type="source"
                position={Position.Right}
                className="bg-red-500"
            />
        </div>
    );
}
