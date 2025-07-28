import { Handle, Position } from '@xyflow/react';

export default function CustomNode({ data, selected }: any) {
    return (
        <div style={{
            padding: '10px 20px',
            border: selected ? '2px solid #ff4444' : '1px solid #999',
            borderRadius: '8px',
            background: selected ? '#fff5f5' : '#fff',
            textAlign: 'center',
            minWidth: '100px',
            boxShadow: selected ? '0 0 8px rgba(255, 68, 68, 0.3)' : 'none'
        }}>
            {/* 🔵 Incoming Handle (Left side) */}
            <Handle
                type="target"
                position={Position.Left}
                style={{ background: '#555' }}
                onConnect={(params) => console.log('Incoming connection', params)}
            />

            {/* Node label */}
            <div>{data.label}</div>

            {/* 🔴 Outgoing Handle (Right side) */}
            <Handle
                type="source"
                position={Position.Right}
                style={{ background: '#f00' }}
            />
        </div>
    );
}
