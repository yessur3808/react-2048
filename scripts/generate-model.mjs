// Generates a simple 2048 policy network and saves it as a TFjs model.
// Input: [1, 16] normalized board state
// Output: [1, 4] move scores (left, up, right, down)
//
// Run once with: node scripts/generate-model.mjs

import * as tf from "@tensorflow/tfjs-node";
import { mkdirSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __dirname = dirname(fileURLToPath(import.meta.url));
const outDir = join(__dirname, "..", "public", "models", "2048");
mkdirSync(outDir, { recursive: true });

const model = tf.sequential();

model.add(
  tf.layers.dense({
    inputShape: [16],
    units: 256,
    activation: "relu",
    kernelInitializer: "glorotUniform",
  })
);

model.add(
  tf.layers.dense({
    units: 128,
    activation: "relu",
    kernelInitializer: "glorotUniform",
  })
);

model.add(
  tf.layers.dense({
    units: 4,
    activation: "softmax",
    kernelInitializer: "glorotUniform",
  })
);

model.compile({ optimizer: "adam", loss: "categoricalCrossentropy" });

model.summary();

await model.save(`file://${outDir}`);
console.log(`\nModel saved to ${outDir}`);
