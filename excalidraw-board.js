import React from "https://esm.sh/react@18.2.0";
import { createRoot } from "https://esm.sh/react-dom@18.2.0/client";
import { Excalidraw } from "https://esm.sh/@excalidraw/excalidraw@0.18.0?deps=react@18.2.0,react-dom@18.2.0";

const mount = document.querySelector("#excalidrawMount");
const bridge = window.whiteboardSession;

if (!mount) {
  bridge?.onError?.("Whiteboard mount was not found.");
} else {
  const root = createRoot(mount);
  const restoredElements = Array.isArray(window.__WHITEBOARD_RESTORE_SCENE__) ? window.__WHITEBOARD_RESTORE_SCENE__ : [];
  root.render(
    React.createElement(Excalidraw, {
      initialData: {
        elements: restoredElements,
        appState: {
          viewBackgroundColor: "#fffefd",
          currentItemStrokeColor: "#15110c",
          currentItemBackgroundColor: "transparent",
          currentItemFontFamily: 1,
          currentItemFontSize: 20,
          currentItemRoughness: 1
        },
        scrollToContent: false
      },
      onChange: (elements, appState, files) => {
        bridge?.onChange?.(elements, appState, files);
      }
    })
  );
  window.requestAnimationFrame(() => bridge?.onReady?.());
}
