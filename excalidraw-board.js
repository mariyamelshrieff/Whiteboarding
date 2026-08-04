import React from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { Excalidraw, MainMenu, convertToExcalidrawElements, exportToBlob } from "https://esm.sh/@excalidraw/excalidraw@0.18.0?deps=react@18.2.0,react-dom@18.2.0";

const mount = document.querySelector("#excalidrawMount");
const bridge = window.whiteboardSession;
let excalidrawApi = null;
let applyingArrowGuard = false;
const rejectedArrowIds = new Set();
const initialTheme = document.documentElement.dataset.theme === "dark" ? "dark" : "light";
const themeValue = (name, fallback) => getComputedStyle(document.documentElement).getPropertyValue(name).trim() || fallback;
const canvasBackground = () => themeValue("--bg-canvas", "transparent");
const drawingStroke = () => themeValue("--text-1", "currentColor");

if (!mount) {
  bridge?.onError?.("Whiteboard mount was not found.");
} else {
  const root = createRoot(mount);
  const restoredElements = Array.isArray(window.__WHITEBOARD_RESTORE_SCENE__) ? window.__WHITEBOARD_RESTORE_SCENE__ : [];
  root.render(
    React.createElement(Excalidraw, {
      excalidrawAPI: (api) => {
        excalidrawApi = api;
        bridge?.onReady?.({
          exportPng: async () => {
            if (!excalidrawApi) throw new Error("The whiteboard is not ready yet.");
            const elements = excalidrawApi.getSceneElements().filter((element) => !element.isDeleted);
            if (!elements.length) return "";
            let dataUrl = await exportScenePng(elements, 1200);
            if (dataUrl.length > 3_500_000) dataUrl = await exportScenePng(elements, 900);
            if (dataUrl.length > 3_500_000) throw new Error("The canvas screenshot is too large to evaluate.");
            return dataUrl;
          },
          clearScene: clearCanvasForNewAttempt,
          insertTemplate,
          setTheme: setExcalidrawTheme,
          runLeftEdgeHitTest
        });
      },
      theme: initialTheme,
      initialData: {
        elements: restoredElements,
        appState: {
          theme: initialTheme,
          viewBackgroundColor: canvasBackground(),
          currentItemStrokeColor: drawingStroke(),
          currentItemBackgroundColor: "transparent",
          currentItemFontFamily: 1,
          currentItemFontSize: 20,
          currentItemRoughness: 1
        },
        scrollToContent: false
      },
      onChange: (elements, appState, files) => {
        if (!applyingArrowGuard && !appState.draggingElement) {
          const guarded = guardCommittedArrows(elements);
          if (guarded.changed && excalidrawApi) {
            applyingArrowGuard = true;
            excalidrawApi.updateScene({ elements: guarded.elements });
            queueMicrotask(() => { applyingArrowGuard = false; });
            if (guarded.rejectedShortArrow) bridge?.onToast?.("Arrow too short to connect — drag between the two shapes");
            bridge?.onChange?.(guarded.elements, appState, files);
            return;
          }
        }
        bridge?.onChange?.(elements, appState, files);
      },
      UIOptions: {
        canvasActions: {
          changeViewBackgroundColor: false,
          toggleTheme: false
        }
      }
    }, React.createElement(MainMenu, null,
      React.createElement(MainMenu.Item, { onSelect: openScene }, "Open…"),
      React.createElement(MainMenu.Item, { onSelect: saveScene }, "Save to…"),
      React.createElement(MainMenu.Item, { onSelect: exportImage }, "Export image…"),
      React.createElement(MainMenu.Item, { onSelect: findOnCanvas, shortcut: "⌘F" }, "Find on canvas"),
      React.createElement(MainMenu.Item, { onSelect: resetCanvas }, "Reset canvas")
    ))
  );
}

function guardCommittedArrows(elements) {
  const byId = new Map(elements.map((element) => [element.id, element]));
  let changed = false;
  let rejectedShortArrow = false;
  const nextElements = elements.map((element) => {
    if (element.type !== "arrow" || element.isDeleted) return element;
    if (arrowSpan(element) < 12) {
      changed = true;
      if (!rejectedArrowIds.has(element.id)) {
        rejectedArrowIds.add(element.id);
        rejectedShortArrow = true;
      }
      return {
        ...element,
        isDeleted: true,
        version: (element.version || 1) + 1,
        versionNonce: Math.floor(Math.random() * 2_147_483_647),
        updated: Date.now()
      };
    }
    const endpoints = arrowEndpoints(element);
    const startBinding = guardedBinding(element.startBinding, endpoints.start, byId);
    const endBinding = guardedBinding(element.endBinding, endpoints.end, byId);
    if (sameBinding(startBinding, element.startBinding) && sameBinding(endBinding, element.endBinding)) return element;
    changed = true;
    return {
      ...element,
      startBinding,
      endBinding,
      version: (element.version || 1) + 1,
      versionNonce: Math.floor(Math.random() * 2_147_483_647),
      updated: Date.now()
    };
  });
  return { elements: nextElements, changed, rejectedShortArrow };
}

function arrowSpan(element) {
  const points = Array.isArray(element.points) ? element.points : [];
  const pointSpan = points.length > 1
    ? Math.hypot((Number(points.at(-1)?.[0]) || 0) - (Number(points[0]?.[0]) || 0), (Number(points.at(-1)?.[1]) || 0) - (Number(points[0]?.[1]) || 0))
    : 0;
  return Math.max(Math.hypot(Math.abs(Number(element.width) || 0), Math.abs(Number(element.height) || 0)), pointSpan);
}

function arrowEndpoints(element) {
  const x = Number(element.x) || 0;
  const y = Number(element.y) || 0;
  const points = Array.isArray(element.points) ? element.points : [];
  if (points.length > 1) {
    return {
      start: { x: x + (Number(points[0]?.[0]) || 0), y: y + (Number(points[0]?.[1]) || 0) },
      end: { x: x + (Number(points.at(-1)?.[0]) || 0), y: y + (Number(points.at(-1)?.[1]) || 0) }
    };
  }
  return { start: { x, y }, end: { x: x + (Number(element.width) || 0), y: y + (Number(element.height) || 0) } };
}

function guardedBinding(binding, endpoint, byId) {
  if (!binding?.elementId) return binding || null;
  let target = byId.get(binding.elementId);
  if (target?.type === "text" && target.containerId) target = byId.get(target.containerId) || target;
  if (!target) return null;
  const center = {
    x: (Number(target.x) || 0) + Math.abs(Number(target.width) || 0) / 2,
    y: (Number(target.y) || 0) + Math.abs(Number(target.height) || 0) / 2
  };
  if (Math.hypot(endpoint.x - center.x, endpoint.y - center.y) > 40) return null;
  return target.id === binding.elementId ? binding : { ...binding, elementId: target.id };
}

function sameBinding(first, second) {
  if (!first && !second) return true;
  return Boolean(first && second && first.elementId === second.elementId && first.focus === second.focus && first.gap === second.gap);
}

window.addEventListener("whiteboard-theme-change", (event) => setExcalidrawTheme(event.detail));

function setExcalidrawTheme(detail = {}) {
  if (!excalidrawApi) return;
  const nextTheme = detail.theme === "dark" ? "dark" : "light";
  excalidrawApi.updateScene({
    appState: {
      ...excalidrawApi.getAppState(),
      theme: nextTheme,
      viewBackgroundColor: detail.background || canvasBackground(),
      currentItemStrokeColor: drawingStroke()
    }
  });
}

async function runLeftEdgeHitTest() {
  if (!excalidrawApi || !mount) return { passed: false, reason: "Whiteboard API unavailable" };
  const rect = mount.getBoundingClientRect();
  const start = { x: rect.left + rect.width * 0.05, y: rect.top + rect.height * 0.5 };
  const end = { x: start.x + 36, y: start.y + 28 };
  const target = document.elementFromPoint(start.x, start.y);
  const blockedByUi = Boolean(target?.closest("button, input, textarea, [role='toolbar'], .App-menu, .Island"));
  if (!target || blockedByUi || !target.closest(".excalidraw")) {
    return { passed: false, reason: "The 5% canvas point is covered by editor UI", target: target?.className || target?.tagName || "none" };
  }
  const before = new Set(excalidrawApi.getSceneElements().filter((element) => !element.isDeleted).map((element) => element.id));
  excalidrawApi.setActiveTool({ type: "rectangle" });
  const pointer = (type, point, buttons) => new PointerEvent(type, {
    bubbles: true,
    cancelable: true,
    composed: true,
    pointerId: 804,
    pointerType: "mouse",
    isPrimary: true,
    button: 0,
    buttons,
    clientX: point.x,
    clientY: point.y
  });
  target.dispatchEvent(pointer("pointerdown", start, 1));
  target.dispatchEvent(pointer("pointermove", end, 1));
  target.dispatchEvent(pointer("pointerup", end, 0));
  await new Promise((resolve) => requestAnimationFrame(() => requestAnimationFrame(resolve)));
  const created = excalidrawApi.getSceneElements().find((element) => !element.isDeleted && !before.has(element.id));
  if (created) {
    excalidrawApi.updateScene({
      elements: excalidrawApi.getSceneElements().map((element) => element.id === created.id ? { ...element, isDeleted: true, version: (element.version || 1) + 1, updated: Date.now() } : element)
    });
  }
  excalidrawApi.setActiveTool({ type: "selection" });
  return { passed: Boolean(created), reason: created ? "A rectangle was created at 5% canvas width" : "The pointer gesture did not create an element", target: target.className || target.tagName };
}

function openScene() {
  if (!excalidrawApi) return;
  const input = document.createElement("input");
  input.type = "file";
  input.accept = ".excalidraw,application/json";
  input.addEventListener("change", async () => {
    const file = input.files?.[0];
    if (!file) return;
    try {
      const scene = JSON.parse(await file.text());
      if (!Array.isArray(scene.elements)) throw new Error("This file does not contain an Excalidraw scene.");
      excalidrawApi.updateScene({ elements: scene.elements, appState: scene.appState || {} });
    } catch (error) {
      bridge?.onError?.(error.message || "The whiteboard file could not be opened.");
    }
  });
  input.click();
}

function insertTemplate(kind) {
  if (!excalidrawApi) return;
  const appState = excalidrawApi.getAppState();
  const originX = Math.round((-appState.scrollX || 0) + 80);
  const originY = Math.round((-appState.scrollY || 0) + 120);
  const skeletons = templateSkeletons(kind, originX, originY);
  if (!skeletons.length) return;
  const added = convertToExcalidrawElements(skeletons);
  excalidrawApi.updateScene({ elements: [...excalidrawApi.getSceneElements(), ...added] });
  excalidrawApi.scrollToContent(added, { fitToViewport: false, animate: true });
}

function templateSkeletons(kind, x, y) {
  const uid = Date.now().toString(36);
  const box = (id, dx, dy, width, height, label) => [
    { id, type: "rectangle", x: x + dx, y: y + dy, width, height, strokeColor: drawingStroke(), backgroundColor: "transparent" },
    { type: "text", x: x + dx + 12, y: y + dy + 12, text: label, fontSize: 20, strokeColor: drawingStroke() }
  ];
  if (kind === "user-needs") return [...box(`${uid}-user`, 0, 0, 220, 130, "Primary user\nContext:\nNeeds:")];
  if (kind === "goals-metrics") return [...box(`${uid}-goals`, 0, 0, 260, 150, "Goal\nUser outcome:\nSuccess metric:\nGuardrail:")];
  if (kind === "constraints") return [...box(`${uid}-constraints`, 0, 0, 260, 160, "Constraints\n• Business\n• Technical\n• Trust / accessibility")];
  if (kind === "journey") {
    const first = `${uid}-journey-1`;
    const second = `${uid}-journey-2`;
    const third = `${uid}-journey-3`;
    return [
      ...box(first, 0, 0, 180, 110, "1. Entry\nUser intent"),
      ...box(second, 240, 0, 180, 110, "2. Core action\nDecision"),
      ...box(third, 480, 0, 180, 110, "3. Outcome\nFeedback"),
      { type: "arrow", x: x + 180, y: y + 55, width: 60, height: 0, start: { id: first }, end: { id: second } },
      { type: "arrow", x: x + 420, y: y + 55, width: 60, height: 0, start: { id: second }, end: { id: third } }
    ];
  }
  return [];
}

function saveScene() {
  if (!excalidrawApi) return;
  const scene = {
    type: "excalidraw",
    version: 2,
    source: location.origin,
    elements: excalidrawApi.getSceneElements(),
    appState: { viewBackgroundColor: excalidrawApi.getAppState().viewBackgroundColor },
    files: excalidrawApi.getFiles()
  };
  downloadBlob(new Blob([JSON.stringify(scene, null, 2)], { type: "application/json" }), "whiteboard-practice.excalidraw");
}

async function exportImage() {
  if (!excalidrawApi) return;
  const elements = excalidrawApi.getSceneElements().filter((element) => !element.isDeleted);
  if (!elements.length) {
    bridge?.onError?.("Add something to the canvas before exporting an image.");
    return;
  }
  downloadBlob(await exportSceneBlob(elements, 1800), "whiteboard-practice.png");
}

function findOnCanvas() {
  window.setTimeout(() => {
    document.dispatchEvent(new KeyboardEvent("keydown", { key: "f", code: "KeyF", metaKey: true, ctrlKey: true, bubbles: true }));
  }, 0);
}

function resetCanvas() {
  if (!excalidrawApi || !window.confirm("Reset the canvas? This removes every shape and note from this attempt.")) return;
  clearCanvasForNewAttempt();
}

function clearCanvasForNewAttempt() {
  if (!excalidrawApi) return false;
  excalidrawApi.updateScene({
    elements: [],
    appState: {
      ...excalidrawApi.getAppState(),
      selectedElementIds: {},
      editingElement: null
    }
  });
  excalidrawApi.setActiveTool({ type: "selection" });
  excalidrawApi.history?.clear?.();
  return true;
}

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  window.setTimeout(() => URL.revokeObjectURL(url), 0);
}

async function exportScenePng(elements, maxWidthOrHeight) {
  const blob = await exportSceneBlob(elements, maxWidthOrHeight);
  return blobToDataUrl(blob);
}

async function exportSceneBlob(elements, maxWidthOrHeight) {
  return exportToBlob({
    elements,
    appState: {
      ...excalidrawApi.getAppState(),
      exportBackground: true,
      exportWithDarkMode: excalidrawApi.getAppState().theme === "dark"
    },
    files: excalidrawApi.getFiles(),
    mimeType: "image/png",
    exportPadding: 24,
    maxWidthOrHeight
  });
}

function blobToDataUrl(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result || ""));
    reader.onerror = () => reject(new Error("The canvas screenshot could not be prepared."));
    reader.readAsDataURL(blob);
  });
}
