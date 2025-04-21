import { createContext, useContext, useState, ReactNode } from "react";
import { HeaderState, ContentState, FooterState } from "../types/index";

interface EditorStateContextType {
  headerState?: HeaderState;
  contentState?: ContentState;
  footerState?: FooterState;
  setHeaderState: (state?: HeaderState) => void;
  setContentState: (state?: ContentState) => void;
  setFooterState: (state?: FooterState) => void;
}

const EditorStateContext = createContext<EditorStateContextType | undefined>(
  undefined,
);

export function EditorStateProvider({ children }: { children: ReactNode }) {
  const [headerState, setHeaderState] = useState<HeaderState | undefined>();
  const [contentState, setContentState] = useState<ContentState | undefined>();
  const [footerState, setFooterState] = useState<FooterState | undefined>();

  return (
    <EditorStateContext.Provider
      value={{
        headerState,
        contentState,
        footerState,
        setHeaderState,
        setContentState,
        setFooterState,
      }}
    >
      {children}
    </EditorStateContext.Provider>
  );
}

export function useEditorState() {
  const context = useContext(EditorStateContext);
  if (context === undefined) {
    throw new Error(
      "useEditorState must be used within an EditorStateProvider",
    );
  }
  return context;
}
