# 2048 AI Model

Place your TensorFlow.js model files here:

```
public/models/2048/
  model.json          ← topology + metadata
  *.bin               ← weight shards (referenced by model.json)
```

## Model contract

| | Value |
|---|---|
| Input shape | `[1, 16]` |
| Output shape | `[1, 4]` |
| Direction order | `left, up, right, down` |
| Normalization | `log2(cell) / 17` (0 for empty) |

## Training

The model should be trained to predict the best move (0–3) for a given
flattened 4×4 board state. Any standard policy network trained on 2048
game-play data will work, as long as the input/output shapes above are met.

## Exporting from Python (Keras example)

```python
import tensorflowjs as tfjs
tfjs.converters.save_keras_model(model, "public/models/2048")
```
