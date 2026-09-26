// admin/main.jsx — Entry point for the standalone Admin Panel
import React from "react";
import { createRoot } from "react-dom/client";
import AdminApp from "./AdminApp";
import "./admin.css";

const root = document.getElementById("admin-root");
createRoot(root).render(<AdminApp />);
