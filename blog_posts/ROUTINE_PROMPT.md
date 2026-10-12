# Updated routine prompt changes

Replace the folder/credential parts of the original prompt with:

1. Work in the repo checkout at `blog_posts/` (review/, approved/, published/, .tracker/) instead of `~/blog_posts/`.
2. Credentials: read WP_SITE, WP_USER, WP_APP_PASSWORD from environment variables
   (fall back to ~/.wp_credentials). If missing, send a PushNotification and stop publishing.
3. After any change (new batch, published files moved, tracker updated), `git add blog_posts`,
   commit, and push to the routine's branch. Do not open a PR unless asked.
4. Approval = a file present in `blog_posts/approved/` on the branch. Move it to `published/`
   only after WordPress returns HTTP 201, then commit and push.
5. Everything else (topic library, writing requirements, SEO block, Gmail drafts and summary) unchanged.
