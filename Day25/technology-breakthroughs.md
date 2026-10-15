# FlashAttention: keep tiles, not the whole attention matrix

Technology breakthroughs · Day25 · 15 minutes

Understand how exact tiled attention reduces high-bandwidth-memory traffic without changing the attention result.

## Recall (2 minutes)

<p><a href="../Day21/technology-breakthroughs.html">Day21: Three probability maps, one mask: ensemble confidence is not independent evidence</a></p><p>Mean of 0.90, 0.80 and 0.20?</p><details><summary>Recall first, then reveal the refresher</summary><p>0.63. The ensemble averages probabilities before thresholding.</p></details><p><a href="../Day9/technology-breakthroughs.html">Day9: Closing the terahertz gap with an ultrathin frequency mixer</a></p><p>Two mid-infrared pumps differ by 7 THz. What output frequency does ideal difference-frequency generation target?</p><details><summary>Recall first, then reveal the refresher</summary><p>7 THz. The nonlinear mixing product includes the absolute frequency difference.</p></details>

## Understand (4 minutes)

Standard attention compares every query token with every key token. The score grid grows as sequence length squared. Writing that whole grid to slow, large GPU memory and reading it back can dominate runtime.

FlashAttention tiles the grid. It loads small query/key/value blocks into fast on-chip memory, updates a running softmax summary, and discards each score tile. The final answer is exact up to normal floating-point effects; the full score matrix never has to live in high-bandwidth memory.



For four query tokens and four key tokens, the conceptual score grid has 16 cells. With a 2×2 tile, the algorithm handles four cells at a time, updates running maximum/sum/output values, then reuses the scratch space.



## Read the visual

Green cells are the current scratch tile; red cells belong to other tiles and need not stay resident. The count below separates storage reduction from unchanged dense comparisons.

## Use case: when to use this

Part of the 4-minute explanation.

**When it fits.** Use FlashAttention through a supported framework/kernel when long-sequence exact attention is limited by GPU memory traffic.

**Practical example.** A transformer processes an 8k-token document and cannot afford to materialize every attention score in HBM.

**How to decide.** Use supported kernels and benchmark your shapes/hardware. It does not make quadratic arithmetic linear, and small or unsupported workloads may not benefit.


## Step through the code (within the 5-minute exploration)

Spend about two minutes here and three in the interactive lab. These are actual recorded executions of the synthetic example, replayed in the HTML page.

```python
n=8
tile=4
full_cells=n*n
peak_tile_cells=tile*tile
tiles=(n//tile)**2
comparisons=tiles*peak_tile_cells
```

1. Model an 8×8 score grid processed in 4×4 tiles.

   Changed values: `{"n": 8, "tile": 4}`

2. Compare materializing 64 scores with a 16-score scratch tile.

   Changed values: `{"full_cells": 64, "peak_tile_cells": 16}`

3. Four tiles cover the conceptual score grid.

   Changed values: `{"tiles": 4}`

4. The comparison count remains 64 even though peak score storage is smaller.

   Changed values: `{"comparisons": 64}`

[Full runnable example](examples/technology-breakthroughs.py).

Limits: This is a memory-shape teaching model, not a GPU kernel. It omits heads, batch, bytes per element, backward pass, kernel fusion, hardware constraints and measured speed. The paper reports experimental claims; production gains depend on implementation and hardware.

## Explore (remaining exploration time)

Change sequence length and tile size. Compare full score cells with peak teaching-model tile cells.

Open technology-breakthroughs.html for the executable model.

Model limits: This is a memory-shape teaching model, not a GPU kernel. It omits heads, batch, bytes per element, backward pass, kernel fusion, hardware constraints and measured speed. The paper reports experimental claims; production gains depend on implementation and hardware.

## Quiz (4 minutes)

1. What does FlashAttention avoid materializing in HBM?
   - The entire attention score matrix
   - All query vectors
   - The model weights

2. Does tiling remove quadratic attention arithmetic?
   - Yes, always linear
   - No; it mainly reduces memory traffic for exact attention
   - Only for four tokens

3. Why keep a running maximum during tiled softmax?
   - For numerically stable rescaling as new tiles arrive
   - To select one token only
   - To compress model weights

4. Why can fewer HBM reads improve speed even with the same comparison count?
5. Which benchmark dimensions must match your production workload before adopting a kernel?

<details><summary>Answer key — attempt first</summary>

1. The entire attention score matrix. It computes score blocks and maintains online softmax summaries.

2. No; it mainly reduces memory traffic for exact attention. All query-key comparisons still exist in exact dense attention.

3. For numerically stable rescaling as new tiles arrive. Online softmax must safely combine blocks without overflow.

</details>

## Sources

- [FlashAttention paper](https://arxiv.org/abs/2205.14135) — Submitted May 27, 2022; revised June 23, 2022; checked 2026-10-15.
- [NeurIPS 2022 paper page](https://proceedings.neurips.cc/paper_files/paper/2022/hash/3f1162e4a1c9658a5a4c12b47f35e7c2-Abstract-Conference.html) — NeurIPS 2022; checked 2026-10-15.
