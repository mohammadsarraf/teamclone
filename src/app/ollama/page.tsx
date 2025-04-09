"use client";
import { useState, useEffect, useRef, useCallback } from "react";
import SideMenu from "./components/sidemenu";
import Edit from "./components/BananaEditor";
import { FiSave, FiMessageSquare, FiSend } from "react-icons/fi";
import { GrRedo, GrUndo } from "react-icons/gr";
// Import types
import "./types";
import { EditorStateProvider, useEditorState } from "./hooks/useEditorState";

// Local storage key matching the one in BananaEditor
const STORAGE_KEY = "banana-editor-state";

// Interface for change instructions from LLM
interface ChangeInstructions {
  type: 'color' | 'text' | 'size' | 'layout' | 'gradient';
  target: 'header' | 'content' | 'footer';
  element: string; // ID of element or 'background'
  property: string; // Property to change
  value: any; // New value
  additionalInfo?: any; // Any additional details
}

// Type for chat messages
type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
  timestamp: number;
};

// Main page component
export default function BananaPage() {
  return (
    <EditorStateProvider>
      <Banana />
    </EditorStateProvider>
  );
}

// Main application component
function Banana() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  // Chat related states
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Get editor state from context
  const { 
    headerState, contentState, footerState,
    setHeaderState, setContentState, setFooterState 
  } = useEditorState();

  // State for pending changes that need to be applied
  const [pendingChanges, setPendingChanges] = useState<{
    header?: any;
    content?: any;
    footer?: any;
  } | null>(null);

  // Apply changes via useEffect
  useEffect(() => {
    if (!pendingChanges) return;

    // Apply header changes
    if (pendingChanges.header && window.bananaHeaderEditor?.applyExternalState) {
      setHeaderState(pendingChanges.header);
      window.bananaHeaderEditor.applyExternalState(pendingChanges.header);
    }

    // Apply content changes
    if (pendingChanges.content && window.bananaContentEditor?.applyExternalState) {
      setContentState(pendingChanges.content);
      window.bananaContentEditor.applyExternalState(pendingChanges.content);
    }

    // Apply footer changes
    if (pendingChanges.footer && window.bananaFooterEditor?.applyExternalState) {
      setFooterState(pendingChanges.footer);
      window.bananaFooterEditor.applyExternalState(pendingChanges.footer);
    }

    // Clear pending changes
    setPendingChanges(null);
  }, [pendingChanges, setHeaderState, setContentState, setFooterState]);

  // Check if we have saved data to show loading state
  useEffect(() => {
    // Small delay to ensure components are mounted
    const timer = setTimeout(() => {
      try {
        const savedData = localStorage.getItem(STORAGE_KEY);
        // Even if no data is found, we still want to show the editor
        setIsLoading(false);
      } catch (error) {
        console.error("Error checking for saved editor state:", error);
        setIsLoading(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  // Scroll to bottom when chat history updates
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatHistory]);

  // Focus input when chat opens or after sending a message
  useEffect(() => {
    if (isChatOpen && inputRef.current && !isProcessing) {
      inputRef.current.focus();
    }
  }, [isChatOpen, isProcessing]);

  // Enable undo/redo buttons based on global state
  const [canUndo, setCanUndo] = useState(false);
  const [canRedo, setCanRedo] = useState(false);

  useEffect(() => {
    const checkUndoRedoState = () => {
      if (window.bananaEditor) {
        setCanUndo(!!window.bananaEditor.canUndo);
        setCanRedo(!!window.bananaEditor.canRedo);
      }
    };

    // Check initially
    const timer = setTimeout(checkUndoRedoState, 1000);

    // Set up interval to check periodically
    const interval = setInterval(checkUndoRedoState, 500);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, []);

  // Handle global undo/redo
  const handleUndo = () => {
    if (window.bananaEditor?.undo) {
      window.bananaEditor.undo();
    }
  };

  const handleRedo = () => {
    if (window.bananaEditor?.redo) {
      window.bananaEditor.redo();
    }
  };

  // Process and apply change instructions from LLM
  const applyChangeInstructions = useCallback((instructionsText: string) => {
    try {
      // Extract the instructions block with regex
      const match = instructionsText.match(/CHANGE_INSTRUCTIONS:\s*SIMPLE_FORMAT\s*([\s\S]*?)(?=\n\n|$)/);
      if (!match || !match[1]) {
        console.error("No CHANGE_INSTRUCTIONS block found in:", instructionsText);
        return false;
      }
      
      // Log the raw instructions for debugging
      console.log("Raw instructions:", match[1]);
      
      // Parse the simple key-value format
      const lines = match[1].trim().split('\n');
      const instructions: Record<string, string> = {};
      
      // Process each line to extract key-value pairs
      lines.forEach(line => {
        const parts = line.split(':');
        if (parts.length >= 2) {
          const key = parts[0].trim();
          const value = parts.slice(1).join(':').trim(); // Rejoin in case value contains colons
          instructions[key] = value;
        }
      });
      
      console.log("Parsed instructions:", instructions);
      
      // Convert to our ChangeInstructions format
      const changeInstructions: ChangeInstructions = {
        type: instructions.TYPE as any,
        target: instructions.TARGET as any,
        element: instructions.ELEMENT,
        property: instructions.PROPERTY,
        value: instructions.VALUE
      };
      
      // Add additionalInfo for gradients
      if (instructions.ADDITIONAL_START_COLOR && instructions.ADDITIONAL_END_COLOR) {
        changeInstructions.additionalInfo = {
          startColor: instructions.ADDITIONAL_START_COLOR,
          endColor: instructions.ADDITIONAL_END_COLOR
        };
      }
      
      console.log("Converted instructions:", changeInstructions);
      
      // Prepare changes but don't apply them directly
      const changes: { header?: any; content?: any; footer?: any } = {};
      
      // Apply changes based on target
      switch (changeInstructions.target) {
        case 'header':
          if (headerState) {
            // Use type assertion to access dynamic properties
            const newState = { ...headerState } as any;
            if (changeInstructions.element === 'background') {
              // Handle background changes
              if (changeInstructions.property === 'backgroundColor' || 
                  changeInstructions.property === 'textColor') {
                newState[changeInstructions.property] = changeInstructions.value;
              }
            } else {
              // Handle other header element changes
              // ...
            }
            changes.header = newState;
          }
          break;
          
        case 'content':
          if (contentState) {
            const newState = { ...contentState };
            
            if (changeInstructions.element === 'background') {
              if (!newState.gridSettings) {
                newState.gridSettings = {} as any;
              }
              
              // Use type assertion for grid settings
              const gridSettings = newState.gridSettings as any;
              
              if (changeInstructions.type === 'color') {
                gridSettings.backgroundType = 'solid';
                gridSettings.backgroundColor = changeInstructions.value;
              } else if (changeInstructions.type === 'gradient' && changeInstructions.additionalInfo) {
                gridSettings.backgroundType = 'gradient';
                gridSettings.backgroundGradientStart = changeInstructions.additionalInfo.startColor;
                gridSettings.backgroundGradientEnd = changeInstructions.additionalInfo.endColor;
              }
            } else {
              // Handle specific element changes
              if (newState.layout) {
                const elementIndex = newState.layout.findIndex(item => item.i === changeInstructions.element);
                if (elementIndex >= 0) {
                  newState.layout[elementIndex] = {
                    ...newState.layout[elementIndex],
                    [changeInstructions.property]: changeInstructions.value
                  };
                }
              }
            }
            
            changes.content = newState;
          }
          break;
          
        case 'footer':
          if (footerState) {
            const newState = { ...footerState } as any;
            // Process footer changes
            changes.footer = newState;
          }
          break;
      }
      
      // Queue the changes to be applied via useEffect
      if (Object.keys(changes).length > 0) {
        setPendingChanges(changes);
        return true;
      }
      
      return false;
    } catch (error) {
      console.error("Error applying change instructions:", error);
      return false;
    }
  }, [headerState, contentState, footerState]);

  // Handle chat submission
  const handleChatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!chatMessage.trim() || isProcessing) return;
    
    setIsProcessing(true);
    
    // Save the user's message to display in the chat
    const userMsg = chatMessage;
    setChatMessage(""); // Clear input field right away for better UX
    
    // Add user message to chat history
    const userChatMessage: ChatMessage = {
      role: "user",
      content: userMsg,
      timestamp: Date.now(),
    };
    
    setChatHistory(prev => [...prev, userChatMessage]);
    
    // Add a temporary "processing" message
    const processingMessage: ChatMessage = {
      role: "system",
      content: "Processing...",
      timestamp: Date.now() + 1, // +1 to ensure it sorts after the user message
    };
    
    setChatHistory(prev => [...prev, processingMessage]);
    
    try {
      // Extract only the necessary parts of the editor state to reduce payload size
      const editorStateForLLM = {
        header: headerState ? {
          layout: headerState.layout,
          height: headerState.height,
          enabledElements: headerState.enabledElements,
          // Add other relevant header properties
        } : null,
        content: contentState ? {
          layout: contentState.layout,
          gridSettings: contentState.gridSettings ? {
            // Include base properties we know exist
            rows: contentState.gridSettings.rows,
            columns: contentState.gridSettings.columns,
            margin: contentState.gridSettings.margin,
            padding: contentState.gridSettings.padding,
            
            // Safely include potentially missing properties
            ...(contentState.gridSettings as any),
          } : undefined,
          // Filter out large properties if needed
        } : null,
        footer: footerState ? {
          layout: footerState.layout,
          // Add other relevant footer properties
        } : null,
      };
      
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          message: userMsg,
          model: "llama3",
          editorState: editorStateForLLM
        }),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Server responded with status ${response.status}`);
      }
      
      const data = await response.json();
      
      // Remove the processing message and add the assistant's response
      setChatHistory(prev => {
        // Filter out the processing message
        const filteredHistory = prev.filter(msg => 
          !(msg.role === "system" && msg.content === "Processing...")
        );
        
        // Get the response content
        const responseContent = data.content || "No response received";
        
        // Check if the response contains change instructions
        const hasChangeInstructions = responseContent.includes("CHANGE_INSTRUCTIONS: SIMPLE_FORMAT");
        
        // Add the assistant's response
        const newHistory: ChatMessage[] = [...filteredHistory, {
          role: "assistant", 
          content: responseContent,
          timestamp: Date.now() + 2, // +2 to ensure it sorts after user message
        }];
        
        // Apply change instructions if present
        if (hasChangeInstructions) {
          const success = applyChangeInstructions(responseContent);
          if (success) {
            // Add a system message indicating changes were applied
            newHistory.push({
              role: "system",
              content: "✅ Changes applied successfully",
              timestamp: Date.now() + 3,
            });
          } else {
            // Add an error message
            newHistory.push({
              role: "system",
              content: "❌ Error: Could not apply changes",
              timestamp: Date.now() + 3,
            });
          }
        }
        
        return newHistory;
      });
    } catch (error) {
      console.error("Error fetching from LLM:", error);
      
      // Remove the processing message and add error message
      setChatHistory(prev => {
        // Filter out the processing message
        const filteredHistory = prev.filter(msg => 
          !(msg.role === "system" && msg.content === "Processing...")
        );
        
        // Add the error message
        return [...filteredHistory, {
          role: "system", 
          content: `Error: ${error instanceof Error ? error.message : "Could not connect to Ollama. Make sure it's running with 'llama3' model loaded."}`,
          timestamp: Date.now() + 2,
        }];
      });
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex h-screen bg-[#1b1b1b]">
        {/* Sidebar Skeleton */}
        <div className="w-64 animate-pulse bg-[#232323]"></div>

        {/* Main Content with Window Bar */}
        <div className="flex flex-1 flex-col">
          {/* Main Content Area */}
          <div className="flex-1 overflow-hidden bg-[#1b1b1b] p-8">
            <div className="flex h-full flex-col">
              {/* Window Bar Skeleton */}
              <div className="flex items-center justify-between rounded-t-lg border border-gray-700 bg-[#2a2a2a] p-3">
                {/* Left Side - Controls Skeleton */}
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <div className="size-3 rounded-full bg-red-500/50"></div>
                    <div className="size-3 rounded-full bg-yellow-500/50"></div>
                    <div className="size-3 rounded-full bg-green-500/50"></div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="size-6 rounded bg-gray-600/50"></div>
                    <div className="size-6 rounded bg-gray-600/50"></div>
                  </div>
                </div>

                {/* Center - Title Skeleton */}
                <div className="h-4 w-24 rounded bg-gray-600/50"></div>

                {/* Right Side - Save Button Skeleton */}
                <div className="h-8 w-32 rounded-md bg-indigo-600/50"></div>
              </div>

              {/* Content Container Skeleton */}
              <div className="flex-1 overflow-hidden rounded-b-lg border border-t-0 border-gray-700 bg-[#2a2a2a]">
                {/* Header Skeleton */}
                <div className="h-12 w-full animate-pulse bg-gray-700/30"></div>

                {/* Content Skeleton */}
                <div className="flex h-96 flex-1 flex-col space-y-4 p-8">
                  <div className="h-4 w-3/4 rounded bg-gray-700/30"></div>
                  <div className="h-4 w-1/2 rounded bg-gray-700/30"></div>
                  <div className="h-4 w-5/6 rounded bg-gray-700/30"></div>
                  <div className="h-4 w-2/3 rounded bg-gray-700/30"></div>
                </div>

                {/* Footer Skeleton */}
                <div className="h-12 w-full animate-pulse bg-gray-700/30"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#1b1b1b]">
      {/* Sidebar - Hide in fullscreen */}
      {!isFullscreen && <SideMenu />}

      {/* Main Content with Window Bar */}
      <div className={`flex flex-col ${isFullscreen ? "w-screen" : "flex-1"}`}>
        {/* Main Content Area */}
        <div
          className={`flex-1 ${isFullscreen ? "" : "bg-[#1b1b1b] p-8"} overflow-hidden`}
        >
          <div className="flex h-full flex-col">
            {/* Window Bar */}
            <div
              className={`flex items-center justify-between ${isFullscreen ? "" : "rounded-t-lg"} border border-gray-700 bg-[#2a2a2a] p-3`}
            >
              {/* Left Side - Window Controls */}
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <button
                    className="size-3 rounded-full bg-red-500 hover:bg-red-600"
                    onClick={() => isFullscreen && setIsFullscreen(false)}
                  />
                  <button className="size-3 rounded-full bg-yellow-500 hover:bg-yellow-600" />
                  <button
                    className="size-3 rounded-full bg-green-500 hover:bg-green-600"
                    onClick={() => !isFullscreen && setIsFullscreen(true)}
                  />
                </div>

                {/* Undo/Redo DISABLED not working.*/}
                <div className="flex items-center space-x-2 text-white/80">
                  <button
                    className="rounded p-1 transition-colors hover:bg-[#3a3a3a] disabled:opacity-40"
                    disabled={true}
                  >
                    <GrUndo className="size-4 [&>path]:stroke-white" />
                  </button>
                  <button
                    className="rounded p-1 transition-colors hover:bg-[#3a3a3a] disabled:opacity-40"
                    disabled={true}
                  >
                    <GrRedo className="size-4 [&>path]:stroke-white" />
                  </button>
                </div>
              </div>

              {/* Center - Project Title */}
              <span className="text-sm font-medium text-white/90">
                My Project
              </span>

              {/* Right Side - Save Button */}
              <div className="flex items-center space-x-2">
                <button
                  className="flex items-center gap-2 rounded-md bg-indigo-600 px-3 py-1 text-sm font-medium text-white transition-colors hover:bg-indigo-700 disabled:opacity-40"
                  disabled={true}
                >
                  <FiSave className="size-4" />
                  {false ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>

            {/* Content Container */}
            <div
              className={`flex-1 ${isFullscreen ? "" : "rounded-b-lg"} overflow-hidden border border-t-0 border-gray-700 bg-[#2a2a2a]`}
            >
              <Edit isFullscreen={isFullscreen} />
            </div>
          </div>
        </div>
      </div>

      {/* Chat Button and Chat Interface */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Button */}
        <button
          onClick={() => setIsChatOpen(!isChatOpen)}
          className="flex h-12 w-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg transition-all hover:bg-indigo-700"
        >
          <FiMessageSquare className="size-5" />
        </button>

        {/* Chat Interface */}
        {isChatOpen && (
          <div className="absolute bottom-16 right-0 w-80 rounded-lg border border-gray-700 bg-[#2a2a2a] shadow-xl">
            {/* Chat Response Area */}
            <div 
              ref={chatContainerRef}
              className="h-60 overflow-y-auto p-4 text-white space-y-3"
            >
              {chatHistory.length > 0 ? (
                chatHistory.map((msg, index) => (
                  <div 
                    key={index} 
                    className={`${
                      msg.role === "user" 
                        ? "ml-4 bg-indigo-600/30" 
                        : msg.role === "system" 
                          ? "bg-gray-700/50" 
                          : "mr-4 bg-[#3a3a3a]"
                    } rounded-lg p-3 text-sm`}
                  >
                    {msg.role === "system" && msg.content.startsWith("Error:") ? (
                      <div className="text-red-400">{msg.content}</div>
                    ) : (
                      <div>{msg.content}</div>
                    )}
                  </div>
                ))
              ) : (
                <div className="flex h-full items-center justify-center text-white/50">
                  <p className="text-sm">Ask me anything about your design</p>
                </div>
              )}
            </div>

            {/* Input Area */}
            <form onSubmit={handleChatSubmit} className="flex border-t border-gray-700 p-2">
              <input
                ref={inputRef}
                type="text"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-l-md bg-[#1b1b1b] px-3 py-2 text-sm text-white outline-none"
                disabled={isProcessing}
              />
              <button
                type="submit"
                className="flex items-center justify-center rounded-r-md bg-indigo-600 px-3 text-white disabled:opacity-50"
                disabled={isProcessing}
              >
                <FiSend className="size-4" />
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
