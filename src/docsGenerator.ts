import fs from "node:fs";
import path from "node:path";
import { generateDocumentation } from "./llm";

interface DocMetadata {
  lastUpdated: string;
  sourceHash: string;
}

function hashContent(content: string): string {
  return Buffer.from(content).toString("base64");
}

function readExistingDoc(docPath: string): { content: string; metadata: DocMetadata | null } {
  try {
    const content = fs.readFileSync(docPath, "utf-8");
    const metadataMatch = content.match(/<!--\s*metadata:\s*({.*?})\s*-->/);

    return {
      content,
      metadata: metadataMatch ? JSON.parse(metadataMatch[1]) : null,
    };
  } catch {
    return { content: "", metadata: null };
  }
}

export async function generateDocs(files: { [key: string]: string }, isUpdate = false) {
  // Create docs directory if it doesn't exist
  if (!fs.existsSync("docs")) {
    fs.mkdirSync("docs");
  }

  // Generate individual docs
  const generatedFiles: string[] = [];
  for (const [filePath, content] of Object.entries(files)) {
    const docName = path.basename(filePath, path.extname(filePath));
    const docPath = `docs/${docName}.md`;
    const currentHash = hashContent(content);

    // Check if we need to update this file
    if (isUpdate && fs.existsSync(docPath)) {
      const { content: existingContent, metadata: existingMetadata } = readExistingDoc(docPath);

      // Skip if content hasn't changed
      if (existingMetadata && existingMetadata.sourceHash === currentHash) {
        console.log(`Skipping ${docName} - no changes detected`);
        generatedFiles.push(docName);
        continue;
      }

      // Generate updated documentation using existing content as context
      const prompt = `
        Previous documentation:
        ${existingContent}

        The source code has been updated. Please update the documentation while maintaining
        the same structure and style. Here's the new source code:
        ${content}
      `;

      const documentation = await generateDocumentation(prompt);
      const metadata: DocMetadata = {
        lastUpdated: new Date().toISOString(),
        sourceHash: currentHash,
      };

      fs.writeFileSync(
        docPath,
        `<!-- metadata: ${JSON.stringify(metadata)} -->\n\n${documentation}`
      );
    } else {
      // Generate new documentation
      const documentation = await generateDocumentation(content);
      const metadata: DocMetadata = {
        lastUpdated: new Date().toISOString(),
        sourceHash: currentHash,
      };

      fs.writeFileSync(
        docPath,
        `<!-- metadata: ${JSON.stringify(metadata)} -->\n\n${documentation}`
      );
    }

    generatedFiles.push(docName);
  }

  // Update index
  const indexPath = "docs/index.md";
  if (isUpdate && fs.existsSync(indexPath)) {
    const existingIndex = fs.readFileSync(indexPath, "utf-8");
    const updatedIndex = await generateDocumentation(`
      Current index:
      ${existingIndex}

      Please update this index to include the following files while maintaining the existing structure:
      ${generatedFiles.join("\n")}
    `);
    fs.writeFileSync(indexPath, updatedIndex);
  } else {
    // Generate new index
    const indexContent = `# Project Documentation\n\n## Files\n\n${generatedFiles
      .map((file) => `- [${file}](./${file}.md)`)
      .join("\n")}`;
    fs.writeFileSync(indexPath, indexContent);
  }
}
