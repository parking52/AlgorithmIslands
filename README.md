<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1ZWmr0YZyopVV2N4-tbmivEe9rwQtqTnB

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Add a New Hunt
To add a new treasure hunt: 

1. Create or reuse page references in `data/staticBook.ts` by adding `refId` values to the page grid and the page `references` array.
2. Append a new hunt object to the `hunts` array in `STATIC_BOOK`.
   - Use a unique `id`
   - Set `name`, `difficulty`, `startRefId`, `description`, `topic`, and `concept`
   - Add a `solutionPath` containing `refId`, `description`, and `expectedPage` entries
3. Make sure each `refId` in the hunt exists on a page and each `expectedPage` is a valid page number.
4. Start the app with `npm run dev`, open the hunt sidebar, and verify the new hunt flows between the intended pages.

## Validation Checklist
Before exporting PDF, the app validates:

- Hunt `startRefId` exists
- Hunt `solutionPath` reference IDs exist
- Each `expectedPage` exists
- Pages not referenced by any hunt are flagged
- Pages with no outbound refs are flagged

Automated tests for this validation checklist should be added once a test framework is available.



## Vision
- Le format X.YY est-il le meilleur? Supportera-t-il XXX.YY ? A-t-on une autre option?
- Quel ratio d'occupabilité de la carte doit-on viser? Doit-on rajouter des fausses pistes? Le faire programmatiquement a la fin?
- Faut-il mieux organiser le support pour chaque hunt, pour que ce soit visuellement clair? Comment avoir une bonne separation et integration page/hunt dans le code?
- Separation reference sur la carte, #2.AB, reference dans le codex,  !3.09 ? Il faut décider pour le long terme.
- On peut simuler les Hunts sur l'app, mais cela rajoute de la tech debt ? A virer?
- Devrait-on rajouter un index, qui résume ce que le lecteur a appris (les dances, etc..?)? Ce sera pratique pour les hunts "gros scope" / super mysteres.
