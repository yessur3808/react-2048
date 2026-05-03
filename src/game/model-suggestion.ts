import * as tf from "@tensorflow/tfjs";
import { moveBoard } from "./moves";
import type { Board, Direction } from "./types";

const DIRECTIONS: Direction[] = ["left", "up", "right", "down"];
const MODEL_URL = "/models/2048/model.json";

let cachedModel: tf.LayersModel | null = null;
let loadError: string | null = null;

const loadModel = async (): Promise<tf.LayersModel> => {
  if (cachedModel !== null) {
    return cachedModel;
  }

  if (loadError !== null) {
    throw new Error(loadError);
  }

  try {
    const model = await tf.loadLayersModel(MODEL_URL);
    cachedModel = model;
    return model;
  } catch (err) {
    loadError = err instanceof Error ? err.message : "Failed to load AI model";
    throw new Error(loadError);
  }
};

const preprocessBoard = (board: Board): tf.Tensor2D => {
  const flat = board.flat().map((cell) => {
    if (!cell) return 0;
    return Math.log2(cell) / 17; // max tile 131072 = 2^17
  });

  return tf.tensor2d([flat], [1, 16]);
};

export const suggestAiMove = async (
  board: Board,
): Promise<Direction | null> => {
  const model = await loadModel();

  const input = preprocessBoard(board);
  const output = model.predict(input) as tf.Tensor;
  const scores = Array.from(await output.data()) as number[];

  input.dispose();
  output.dispose();

  // Rank directions by score, pick best legal one
  const ranked = scores
    .map((score, i) => ({ score, direction: DIRECTIONS[i] }))
    .sort((a, b) => b.score - a.score);

  for (const { direction } of ranked) {
    const result = moveBoard(board, direction);
    if (result.changed) {
      return direction;
    }
  }

  return null;
};
