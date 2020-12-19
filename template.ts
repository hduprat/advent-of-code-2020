import { lineBreak, title, result } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(`First exercise: YYYY.`, "green");

  // code here

  result("result:", 0);
  lineBreak();

  title(`Second exercise: ZZZZ.`, "green");

  // code here

  result("result:", 0);
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/XX.example");
  lineBreak();

  // title("----------------------------------");
  // lineBreak();

  // title("Real scenario", "cyan");
  // await playScenario("input/XX");
  // lineBreak();
}

main();
