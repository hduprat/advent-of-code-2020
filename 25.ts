import { lineBreak, title, result, error, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";
import { toNumber } from "./utils/number";

const findLoopSize = (publicKey: number, verbose: boolean = true): number => {
  let loopSize = 0;
  let value = 1;

  while (value !== publicKey) {
    value = (value * 7) % 20201227;
    if (verbose) text(value);
    loopSize++;
  }

  return loopSize;
};

const encrypt = (subject: number, loopSize: number): number => {
  let value = 1;
  for (let i = 0; i < loopSize; i++) {
    value = (value * subject) % 20201227;
  }

  return value;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);

  title(
    `First exercise: find the encryption key of the card and the door.`,
    "green"
  );

  const cardPublicKey = toNumber(lines[0]);
  const doorPublicKey = toNumber(lines[1]);

  try {
    const cardLoopSize = findLoopSize(cardPublicKey, false);
    result("Found the card loop size! It is", cardLoopSize);
    const doorLoopSize = findLoopSize(doorPublicKey, false);
    result("Found the door loop size! It is", doorLoopSize);

    const cardEncryptionKey = encrypt(doorPublicKey, cardLoopSize);
    const doorEncryptionKey = encrypt(cardPublicKey, doorLoopSize);

    if (cardEncryptionKey !== doorEncryptionKey)
      throw new Error(
        `The encryption keys should be identical. Here we have these values: ${cardEncryptionKey} and ${doorEncryptionKey}`
      );
    result("The encryption key is:", cardEncryptionKey);
  } catch (err) {
    error(err.message);
  }
  lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/25.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/25");
  lineBreak();
}

main();
