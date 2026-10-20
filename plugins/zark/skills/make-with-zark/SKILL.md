---
name: make-with-zark
description: Use when the user asks Zark (or asks for) a picture, video, song, voice-over, sound effect, captions, a template or an episode-style short film, or wants to edit media they already have. Explains how to hand the request to Zark's zark_ai tool and show what comes back.
---

# Make media with Zark

Zark makes and edits pictures, short videos, music (sung or instrumental), voice, sound effects, captions and
episode-style short films. Its main tool is `zark_ai`.

## Hand over the user's own words

- Put the user's request in `prompt` in their own words. Do not write a model prompt, a script or a shot list
  for them: Zark plans the work, writes its own prompts and picks the model for each step.
- Set `model` only when the user names one. To see what models exist and what they cost, ask `zark_ai` in
  words (for example "which video models do you have?"). That answer is free and makes nothing.
- For many items at once ("12 pictures of...") send one request. Zark answers with one plan and one total.
- Ready-made looks are templates: `list_presets`, then `get_preset`, then `run_preset`.
- Episodes (a story told scene by scene): `list_episode_options`, then `start_episode`; `get_episode` shows
  progress and `continue_episode` offers the next scene.
- To use the user's own file, pass a public link with `import_file_from_url`, or make an upload page with
  `create_upload_link` and give the user the link.

## Show the result

- The picture, video or audio is the answer. Show it; add a short line only if it helps.
- Do not list credits, cost or model unless the user asks. `get_run_status` with `verbose=true` gives them.
- `list_files` and `get_file` find earlier work. `download_run_files` gives one zip link for a finished run.

## When Zark asks something

A result with status `needs_input` is a question for the user (a choice, or a price). Show it to the user in
plain words and wait for their answer, then send it with `answer_question` on the same `runId`. For price
questions, follow the `zark-prices` skill.
