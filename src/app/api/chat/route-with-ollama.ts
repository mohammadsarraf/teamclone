import { NextResponse } from 'next/server';

// This is a more complete example showing how to integrate with Ollama
// To use this, you'd need to:
// 1. Install the Ollama Node.js package: npm install ollama
// 2. Rename this file to route.ts (replacing the simulated version)

// Note: Since Next.js API routes run on the server, this would work
// when deployed, but for local development, you need Ollama installed.

export async function POST(request: Request) {
  try {
    const { message, model = "llama3" } = await request.json();

    if (!message) {
      return NextResponse.json(
        { error: "Message is required" },
        { status: 400 }
      );
    }

    console.log(`[Ollama] Sending message to ${model}: ${message}`);
    
    // Option 1: Using Ollama REST API directly with fetch
    const response = await fetch('http://localhost:11434/api/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: model,
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Ollama API returned ${response.status}`);
    }
    
    const data = await response.json();
    
    return NextResponse.json({
      content: data.message.content,
    });
    
    // Option 2: Using the Ollama Node.js package
    // Uncomment this code and comment out Option 1 to use the package
    /*
    // This would require: npm install ollama
    import ollama from 'ollama';
    
    const response = await ollama.chat({
      model: model,
      messages: [
        {
          role: "user",
          content: message,
        },
      ],
    });
    
    return NextResponse.json({
      content: response.message.content,
    });
    */
    
  } catch (error) {
    console.error('Error processing chat request:', error);
    return NextResponse.json(
      { error: "Failed to process request" },
      { status: 500 }
    );
  }
} 