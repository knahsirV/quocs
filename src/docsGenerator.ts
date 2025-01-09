import fs from "node:fs";

function makeDocsDir() {
  if (fs.existsSync("docs")) {
    console.log("docs exists");
  } else {
    fs.mkdir("docs", (err) => {
      if (err) {
        return console.error(err);
      }
      console.log("Docs directory created successfully!");
    });
  }
}

makeDocsDir();
