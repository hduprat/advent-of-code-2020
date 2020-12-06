import * as fs from "fs";
import * as readline from "readline";

const LINE_SEPARATOR = "";
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
      lineBuffer += line + LINE_SEPARATOR;
    });

    lineReader.on("close", () => {
      fileBuffer.push(lineBuffer);
      resolve(fileBuffer);
    });
  });
