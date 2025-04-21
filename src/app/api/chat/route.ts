import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const { message, model = "llama3", editorState } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 },
      );
    }

    console.log(`[Ollama] Sending message to ${model}: ${message}`);

    // Format editor state to be included in the prompt
    let editorStateDescription = "";

    if (editorState) {
      // Process header data
      if (editorState.header) {
        editorStateDescription += "--- HEADER DATA ---\n";
        editorStateDescription += `Layout: ${editorState.header.layout}\n`;
        editorStateDescription += `Height: ${editorState.header.height}px\n`;
        if (editorState.header.enabledElements) {
          editorStateDescription += "Enabled Elements: ";
          editorStateDescription += Object.entries(
            editorState.header.enabledElements,
          )
            .filter(([_, value]) => value)
            .map(([key]) => key.replace("is", ""))
            .join(", ");
          editorStateDescription += "\n";
        }
        editorStateDescription += "\n";
      }

      // Process content data
      if (editorState.content && editorState.content.layout) {
        editorStateDescription += "--- CONTENT DATA ---\n";

        if (editorState.content.gridSettings) {
          const settings = editorState.content.gridSettings;
          editorStateDescription += `Grid: ${settings.columns} columns x ${settings.rows} rows\n`;

          // Improved background information handling
          if (
            settings.backgroundType === "gradient" &&
            settings.backgroundGradientStart &&
            settings.backgroundGradientEnd
          ) {
            editorStateDescription += `Background: Gradient from ${settings.backgroundGradientStart} to ${settings.backgroundGradientEnd}\n`;
          } else if (settings.backgroundColor) {
            editorStateDescription += `Background Color: ${settings.backgroundColor}\n`;
          }

          // Add other grid settings that might be relevant
          if (settings.contentWidth) {
            editorStateDescription += `Content Width: ${settings.contentWidth}\n`;
          }

          if (settings.contentAlignment) {
            editorStateDescription += `Content Alignment: ${settings.contentAlignment}\n`;
          }

          if (settings.verticalAlignment) {
            editorStateDescription += `Vertical Alignment: ${settings.verticalAlignment}\n`;
          }

          editorStateDescription += "\n";
        }

        // Process layout items
        if (editorState.content.layout.length > 0) {
          editorStateDescription += "Content Items:\n";

          editorState.content.layout.forEach((item: any, index: number) => {
            editorStateDescription += `${index + 1}. ${item.type || "Item"} (${item.i})\n`;

            if (item.type === "textbox" && item.content) {
              // Clean content from HTML tags for better readability
              const textContent = item.content.replace(/<[^>]*>?/gm, "");
              editorStateDescription += `   Text: "${textContent.substring(0, 50)}${textContent.length > 50 ? "..." : ""}"\n`;
            }

            if (item.backgroundColor) {
              editorStateDescription += `   Background: ${item.backgroundColor}\n`;
            }

            if (item.textColor) {
              editorStateDescription += `   Text Color: ${item.textColor}\n`;
            }

            if (item.fontSize) {
              editorStateDescription += `   Font Size: ${item.fontSize}px\n`;
            }

            if (item.fontFamily) {
              editorStateDescription += `   Font Family: ${item.fontFamily}\n`;
            }

            editorStateDescription += `   Position: x=${item.x}, y=${item.y}, w=${item.w}, h=${item.h}\n`;
            editorStateDescription += "\n";
          });
        }
      }

      // Process footer data
      if (editorState.footer) {
        editorStateDescription += "--- FOOTER DATA ---\n";
        // Add footer-specific information here
        editorStateDescription += "\n";
      }
    }

    // Create a system prompt that includes editor state information
    const systemPrompt = editorState
      ? `You are an AI assistant for a website editor called Banana. 
You have access to the current state of the editor which is designing a website.
The user will ask questions about the design or request changes.
Here is the current editor state:

${editorStateDescription}

When answering questions about the design, refer to the specific elements by their properties.
You can describe colors, layouts, positions, and text content from the editor state.

IMPORTANT NOTES ON BACKGROUND:
- If you see 'backgroundType: gradient' with 'backgroundGradientStart' and 'backgroundGradientEnd', this means
  the background is a gradient from one color to another, NOT a solid color.
- When asked about background color and there's a gradient, ALWAYS mention that it's a gradient and specify both colors.
- Never default to #ffffff (white) unless you explicitly see that color in the state.

HANDLING CHANGE REQUESTS:
- When the user asks to change something (like color, text, size, etc.), identify this as a change request.
- Respond with a detailed explanation of what needs to be changed.
- At the end of your response, include a change instruction in this simplified format:
  
  CHANGE_INSTRUCTIONS: SIMPLE_FORMAT
  TYPE: color (or: text, size, layout, gradient)
  TARGET: content (or: header, footer)
  ELEMENT: background (or element ID)
  PROPERTY: backgroundColor (or: textColor, fontSize, etc.)
  VALUE: #0000ff (or other appropriate value)
  
  For gradient changes, add these lines:
  ADDITIONAL_START_COLOR: #ff0000
  ADDITIONAL_END_COLOR: #0000ff

  IMPORTANT: Do NOT attempt to format this as JSON. Use the simple key-value format exactly as shown above.
  
  For example, if asked to change the background color to blue, use:
  
  CHANGE_INSTRUCTIONS: SIMPLE_FORMAT
  TYPE: color
  TARGET: content
  ELEMENT: background
  PROPERTY: backgroundColor
  VALUE: #0000ff
  
  For a gradient change, use:
  
  CHANGE_INSTRUCTIONS: SIMPLE_FORMAT
  TYPE: gradient
  TARGET: content
  ELEMENT: background
  PROPERTY: backgroundType
  VALUE: gradient
  ADDITIONAL_START_COLOR: #ff0000
  ADDITIONAL_END_COLOR: #0000ff

Be helpful and provide accurate information based on the editor state.`
      : "You are an AI assistant for a website editor called Banana.";

    // Connect to local Ollama instance
    const response = await fetch("http://localhost:11434/api/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "system",
            content: systemPrompt,
          },
          {
            role: "user",
            content: message,
          },
        ],
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama API returned ${response.status}`);
    }

    const data = await response.json();

    return NextResponse.json({
      content: data.message.content,
    });
  } catch (error) {
    console.error("Error processing chat request:", error);
    return NextResponse.json(
      {
        error:
          "Failed to connect to Ollama. Make sure Ollama is running on your machine with 'llama3' model loaded.",
      },
      { status: 500 },
    );
  }
}
