import { intersect } from "./utils/array";
import { lineBreak, title, result, text } from "./utils/console";
import { getLinesOfFile } from "./utils/getLinesOfFile";

type AllergenPossibilityMap = Map<string, string[][]>;

const INGREDIENT_LIST_REGEX = /^([\w\s]+)\s\(contains\s([\w,\s]+)\)$/;

const buildAllergenPossibilityMap = (
  input: string[]
): {
  map: AllergenPossibilityMap;
  allergens: string[];
  ingredients: string[];
} => {
  const allergenPossibilities = new Map<string, string[][]>();
  const allIngredients: string[] = [];
  const allAllergens: string[] = [];
  input.forEach((line) => {
    const [, ingredientsStr, allergensStr] = INGREDIENT_LIST_REGEX.exec(line);
    const ingredients = ingredientsStr.split(/\s/);
    const allergens = allergensStr.split(/,\s/);

    allIngredients.push(...ingredients);
    allAllergens.push(...allergens);

    allergens.forEach((allergen) => {
      const value = allergenPossibilities.has(allergen)
        ? [...allergenPossibilities.get(allergen), ingredients]
        : [ingredients];
      allergenPossibilities.set(allergen, value);
    });
  });

  return {
    map: allergenPossibilities,
    ingredients: allIngredients,
    allergens: allAllergens,
  };
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const {
    map: allergenPossibilities,
    ingredients: ingredientsWithDuplicates,
  } = buildAllergenPossibilityMap(lines);
  text(allergenPossibilities);

  const potentiallyAllergenicIngredients = new Set<string>();
  allergenPossibilities.forEach((ingredientLists) => {
    intersect(...ingredientLists).forEach((ingredient) => {
      potentiallyAllergenicIngredients.add(ingredient);
    });
  });

  text("potentially allergenic ingredients:", potentiallyAllergenicIngredients);
  const safeIngredients = ingredientsWithDuplicates.filter(
    (ingredient) => !potentiallyAllergenicIngredients.has(ingredient)
  );

  text("safe ingredients:", safeIngredients);

  title(`First exercise: find all occurrences of non-allergens.`, "green");
  result("result:", safeIngredients.length);
  lineBreak();

  // title(`Second exercise: ZZZZ.`, "green");

  // // code here

  // result("result:", 0);
  // lineBreak();
};

async function main() {
  title("Example scenario", "cyan");
  await playScenario("input/21.example");
  lineBreak();

  title("----------------------------------");
  lineBreak();

  title("Real scenario", "cyan");
  await playScenario("input/21");
  lineBreak();
}

main();
