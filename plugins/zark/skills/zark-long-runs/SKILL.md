---
name: zark-long-runs
description: Use when a Zark run is still going (status running), when a Zark video, film or batch takes more than a minute, or when the user asks to check on or stop a Zark job. Explains how to wait without busy loops and how to stop a run.
---

# Wait for long Zark runs

Videos, songs, batches and films can take several minutes.

## Waiting

- Calls wait for the result by default (`wait=true`). Each call holds for up to about 50 seconds, then answers
  with status `running` and the run's `runId`.
- To keep waiting, call `get_run_status` with that same `runId`. Each call waits up to about 50 seconds more.
  Do not sleep in a loop, start the same request again, or make a new run to "check".
- Keep the user informed in one short line while it runs (for example "Still making your video").
- `get_run_events` lists the steps so far, if the user wants to know what Zark is doing.

## Finishing

- `complete`: show the media.
- `partial`: some items were made. Show them and say how many of the requested items came back. Only what
  was made is charged.
- `needs_input`: Zark is asking the user something. Show the question and wait for the user.
- `failed`: tell the user plainly what Zark said went wrong. Do not retry a paid make without the user's yes.

## Stopping

If the user says stop, call `cancel_run` with the `runId`.
