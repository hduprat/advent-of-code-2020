import * as fs from "fs";
import * as readline from "readline";

export const getLinesOfFile = async (path: string): Promise<string[]> =>
  new Promise<string[]>((resolve) => {
    const fileBuffer: string[] = [];
    const iStream = fs.createReadStream(path);
    const lineReader = readline.createInterface(iStream);

    lineReader.on("line", (line) => {
      fileBuffer.push(line);
    });

    lineReader.on("close", () => {
      resolve(fileBuffer);
    });
  });
