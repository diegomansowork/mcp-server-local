import { Server} from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { ListToolsRequestSchema,
    CallToolRequestSchema,
 } from "@modelcontextprotocol/sdk/types.js";

interface SaludoArgs {
    name: string;
}

// Define the CallToolRequestSchema for the "saludo" tool.
const server = new Server(
    {
       name: "mcp-diego-saludo",
       version: "1.0.0"
    },
    {
        capabilities: {
            tools: {},
        },
    }
);

//Handle ListTools requests by returning a single tool called "saludo".
server.setRequestHandler(ListToolsRequestSchema, async () => {
    return {
        tools: [
            {
                name: "saludo",
                description: "Devuelve un saludo personalizado",
                inputSchema: {
                    type: "object",
                    properties: {
                        name: {
                            type: "string",
                            description: "El nombre de la persona a saludar",
                        },
                    },
                    required: ["name"],   
                },
            }
        ],   
    };
});

//Handle CallTool requests for the "saludo" tool.
server.setRequestHandler(CallToolRequestSchema, async (request) => {
    const { name, arguments: args } = request.params;
    
    if (name === "saludo") {
        const { name: personName } = args as unknown as SaludoArgs;
        return {
            content:[ 
            {
                type: "text",
                text: `¡Hola, ${personName}! ¡Encantado de saludarte!`,
            },
        ],
        };
    }

    throw new Error(`Herramienta desconocida: ${name}`);
});

//Start the server.
async function main(): Promise<void> {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("Servidor MCP de saludo está corriendo...");
}

main().catch((error: Error) => {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
}   );  

