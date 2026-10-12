# Blog pipeline (suncoastsl.com)

State lives in this repo so it survives between scheduled runs.

- `review/`    new drafts written by the weekly routine
- `approved/`  move a file here (on GitHub or locally) to publish it on the next run
- `published/` files moved here after a successful WordPress publish
- `.tracker/`  `last_batch.txt` (date of last batch), `used_topics.txt`

Credentials are NOT stored here. Set `WP_SITE`, `WP_USER`, `WP_APP_PASSWORD`
as environment variables on the routine's environment (claude.ai/code).
