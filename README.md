# DAG Visualizer

A modern, interactive Directed Acyclic Graph (DAG) visualizer built with React, TypeScript, and Vite. This application allows users to create, manipulate, and validate directed acyclic graphs through an intuitive drag-and-drop interface.

## 🚀 Features

- **Interactive Graph Creation**: Add and delete nodes with custom labels
- **Real-time DAG Validation**: Automatic cycle detection to ensure graph validity
- **Drag & Drop Interface**: Intuitive node positioning and connection management
- **Visual Feedback**: Clear status indicators and selection highlighting
- **Keyboard Shortcuts**: Delete key to remove selected nodes and edges
- **Auto Layout**: Instantly arrange nodes vertically or horizontally
- **Clear Canvas**: Remove all nodes and edges with one click
- **Modern UI**: Beautiful gradient design with dark mode support
- **Responsive Controls**: Mini-map and zoom controls for better navigation

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Graph Library**: @xyflow/react (React Flow)
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **Notifications**: Sonner toast notifications
- **Icons**: Lucide React

## 📦 Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd dag
```

2. Install dependencies:

```bash
npm install
# or
bun install
```

3. Start the development server:

```bash
npm run dev
# or
bun dev
```

4. Open your browser and navigate to `http://localhost:5173`

## 🎯 Usage

### Adding Nodes

- Click the "Add Node" button
- Enter a name for the node when prompted
- The node will appear at a random position on the canvas

### Connecting Nodes

- Drag from the red handle (right side) of a source node
- Drop onto the blue handle (left side) of a target node
- The connection will be established if it doesn't create a cycle

### Deleting Nodes

- Select a node by clicking on it
- Click the "Delete Node" button or press the Delete key
- The node and all its connections will be removed

### Navigation

- **Pan**: Click and drag on empty canvas areas
- **Zoom**: Use mouse wheel or the zoom controls
- **Mini-map**: Use the mini-map for quick navigation
- **Fit View**: Use the fit view button to see all nodes
- **Auto Layout**: Use the "Auto Layout Vertical" or "Auto Layout Horizontal" buttons to automatically arrange nodes
- **Clear Canvas**: Use the "Clear Canvas" button to remove all nodes and edges

## 🔍 DAG Validation

The application automatically validates the graph structure:

- ✅ **Valid DAG**: No cycles detected
- ❌ **Invalid DAG**: Cycle detected - connections that would create cycles are prevented

## 🎨 Customization

### Styling

The application uses Tailwind CSS for styling. You can customize the appearance by modifying:

- `src/App.css` - Global styles
- `src/components/CustomNode/CustomNode.tsx` - Node appearance
- Tailwind classes in components

### Node Types

To add new node types:

1. Create a new component in `src/components/`
2. Register it in the `nodeTypes` object in `App.tsx`
3. Update the node creation logic

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🏗️ Project Structure

```
src/
├── components/
│   ├── CustomNode/
│   │   └── CustomNode.tsx    # Custom node component
│   └── ui/
│       ├── button.tsx        # Reusable button component
│       └── sonner.tsx        # Toast notification component
├── lib/
│   └── utils.ts              # Utility functions
├── App.tsx                   # Main application component
├── main.tsx                  # Application entry point
└── index.css                 # Global styles
```

## 🙏 Tech-Stack

- [React Flow](https://reactflow.dev/) for the graph visualization library
- [Tailwind CSS](https://tailwindcss.com/) for the styling framework
- [Shadcn UI](https://www.shadcn.com/) for accessible UI components
- [Vite](https://vitejs.dev/) for the fast build tool
