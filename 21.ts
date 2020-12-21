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

const findPotentiallyAllergenicIngredients = (
  allergenPossibilities: AllergenPossibilityMap
): Map<string, string[]> => {
  const potentiallyAllergenicIngredients = new Map<string, string[]>();

  allergenPossibilities.forEach((ingredientLists, allergen) => {
    potentiallyAllergenicIngredients.set(
      allergen,
      intersect(...ingredientLists)
    );
  });

  return potentiallyAllergenicIngredients;
};

const associateIngredientsWithAllergens = (
  allergenMap: Map<string, string[]>
): Map<string, string> => {
  const allergenicIngredientsMap = new Map<string, string>();
  const allergenicIngredientsArray: string[] = [];

  do {
    allergenMap.forEach((ingredients, allergen) => {
      if (ingredients.length === 0) return;

      if (ingredients.length === 1) {
        allergenicIngredientsMap.set(allergen, ingredients[0]);
        allergenicIngredientsArray.push(ingredients[0]);
        return;
      }

      allergenMap.set(
        allergen,
        ingredients.filter(
          (ingredient) => !allergenicIngredientsArray.includes(ingredient)
        )
      );
    });
  } while (allergenicIngredientsMap.size < allergenMap.size);

  return allergenicIngredientsMap;
};

const playScenario = async (path: string) => {
  const lines = await getLinesOfFile(path);
  const {
    map: allergenPossibilities,
    ingredients: ingredientsWithDuplicates,
  } = buildAllergenPossibilityMap(lines);
  text(allergenPossibilities);

  const potentiallyAllergenicIngredientsByAllergen = findPotentiallyAllergenicIngredients(
    allergenPossibilities
  );
  text(
    "potentially allergenic ingredients by allergen:",
    potentiallyAllergenicIngredientsByAllergen
  );
  const potentiallyAllergenicIngredients = new Set<string>();
  potentiallyAllergenicIngredientsByAllergen.forEach((ingredientList) => {
    ingredientList.forEach((ingredient) => {
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

  title(
    `Second exercise: list allergenic ingredients sorted by allergen.`,
    "green"
  );

  const allergenicIngredients = associateIngredientsWithAllergens(
    potentiallyAllergenicIngredientsByAllergen
  );

  const sortedMap = new Map<string, string>(
    [...allergenicIngredients.entries()].sort()
  );
  text(sortedMap);

  result("result:", [...sortedMap.values()].join(","));
  lineBreak();
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
