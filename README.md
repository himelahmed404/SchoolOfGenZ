# School of GenZ: marketing site

## Where the data comes from

Batches, single courses, prices, the syllabus, sales copy, the payment numbers and the blog are read from the School of GenZ API (the `server/` folder of the LMS repo). Nothing a visitor reads about a batch, a course or a post is kept in this repo.

- `src/lib/api.js` reads `/v1/public/*` on the server and keeps each answer for a minute, so a price changed in the admin console shows here within a minute or so.
- `src/lib/site-data.js` turns the API's numbers and dates into the Bangla strings the pages show.
- The enrollment form (`src/app/enroll`) asks the API for the price, checks a coupon and sends the form through `/api/v1/public/*`, the only part of the API that `next.config.mjs` forwards. `src/lib/enroll.js` words the API's error codes in Bangla.
- `/blog` lists what is published (`/v1/public/blog`) and `/blog/[slug]` shows one post. Posts are written in the admin console's Blog section; a draft is a 404 here. A post's closing box leads to the program the post names, or to the list of its side of the school.
- `src/lib/data/` is gone. Its batches, courses and posts were read into the API's `server/src/db/seed/site.json` before it was removed; the commit before this one still has the files.

| Variable | What it is |
|---|---|
| `API_ORIGIN` | Where the API runs. In development it defaults to `http://localhost:4000`. With none set in production the lists are empty and the form cannot send. |
| `NEXT_PUBLIC_TURNSTILE_SITE_KEY` | The Cloudflare Turnstile site key for the enrollment form. With none set the form shows no check. |

To run it beside the LMS, which also uses port 3000: start the API (`npm run dev:api` in the LMS repo), then `npm run dev -- -p 3100` here.

This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
# SchoolOfGenZ
