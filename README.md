This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

## Mike System Prompt — Quarterly Audit

The system prompt in `app/api/chat/route.ts` contains hardcoded rates and deadlines for Polish tax law.
These **MUST be verified every quarter**.

### Audit checklist (verify and update in `app/api/chat/route.ts`)

- [ ] ZUS contribution rates (społeczne, zdrowotna)
- [ ] Statutory interest rate (odsetki ustawowe za opóźnienie)
- [ ] Tax interest rate (odsetki podatkowe)
- [ ] Per diem rate (dieta krajowa) — also update `PromptLibrary.tsx` id:40 comment
- [ ] VAT rates (any new categories or exceptions)
- [ ] KSeF implementation status and date
- [ ] Any new tax thresholds or limits

### Schedule

January · April · July · October

**Owner:** [assign person]

Update the `// Last verified:` and `// Next audit due:` comments in the system prompt after each audit.
