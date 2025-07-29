import { ReactFlowProvider } from "@xyflow/react"
import FlowWrapper from "./components/FlowWrapper/FlowWrapper"

export default function App() {
  return (
    <ReactFlowProvider>
      <FlowWrapper />
    </ReactFlowProvider>
  )
}