#!/bin/bash
# cf pages deploy
npm run build
# upload dist/ to cf pages
# use: wrangler pages deploy dist --project-name=resumeme
