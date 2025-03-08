import React from "react";
import { createRoot } from "react-dom/client";
import GameComponent from "./game/GameComponent.jsx";

const container = document.getElementById("root");
const root = createRoot(container);
root.render(<GameComponent />);
