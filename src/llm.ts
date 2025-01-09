import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HUGGINGFACE_API_TOKEN);

export async function generateDocumentation(content: string): Promise<string> {
  try {
    const result = await hf.textGeneration({
      model: "mistralai/Mistral-7B-Instruct-v0.2",
      inputs: `Generate comprehensive documentation for the following code/content. Focus on:
      1. High-level overview
      2. Key components and their relationships
      3. Important implementation details
      4. Usage examples if applicable

      Content:
      ${content}`,
      parameters: {
        max_new_tokens: 1000,
        temperature: 0.7,
      },
    });

    return result.generated_text;
  } catch (error) {
    console.error("Error generating documentation:", error);
    throw error;
  }
}
