---
name: zark-prices
description: Use when Zark returns a price question before making something, when the user asks how much a Zark picture, video or template costs, or asks about their Zark credits. Explains how to show prices and get the user's own yes before anything is spent.
---

# Zark prices and the user's yes

Making things with Zark spends credits from the user's own Zark account. Looking things up is free.

## Before anything is made

- A paid make first comes back as a question with the price (status `needs_input`). For several items it is
  one plan with each item's price and the total.
- Show the user the price and the choices in plain words, then stop and wait for the user's answer.
- Only the user approves a price. Never answer a price question yourself, never pick "approve" for them, and
  never treat an earlier yes as a yes for a new price.
- When the user says yes, send their choice with `answer_question` on the same `runId`. When they say no,
  send "stop" the same way, or just leave it.
- Do not use `mode: "just_make_it"` or raise `maxCredits` unless the user asked for that and gave the limit.

## Price and credit questions

- "How much does a picture or video cost?": ask `zark_ai` in words. It answers with prices and makes nothing.
- A template's price: `quote_preset`. It makes nothing.
- "How many credits do I have?": `get_balance`.
- If the account is out of credits, tell the user they need more Zark credits. Do not offer to buy them.
