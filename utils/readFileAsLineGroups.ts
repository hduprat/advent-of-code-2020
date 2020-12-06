import * as fs from "fs";
import * as readline from "readline";

const LINE_SEPARATOR = "\n";
export const readFileAsLineGroups = async (path: string): Promise<string[]> =>
  new Promise<string[]>((resolve) => {
    const fileBuffer: string[] = [];
    let lineBuffer = "";
    const iStream = fs.createReadStream(path);
    const lineReader = readline.createInterface(iStream);

    lineReader.on("line", (line) => {
      if (line === "") {
        fileBuffer.push(lineBuffer);
        lineBuffer = "";
        return;
      }
      if (lineBuffer !== "") lineBuffer += LINE_SEPARATOR;
      lineBuffer += line;
    });

    lineReader.on("close", () => {
      fileBuffer.push(lineBuffer);
      resolve(fileBuffer);
    });
  });
