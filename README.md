## Vārdu Dārza Suflieris 

This repo contains "cheats" for a popular word puzzle game "Word Yard" for Latvian language. 
Word corpus is sourced from the awesome [LUMII Tēzaurs](https://github.com/LUMII-AILab/Tezaurs) repo.
I wanted to try out bunch of new stuff for this project (e.g. Recoil + Suspense) but in the  
end it turned out, I didn't really need Recoil (due to the use of Web Worker). However, I used `styled-components`, and `firebase` for this
project for the first time (even though in a very limited capacity). The search implementation is very naive (`(O)!` complexity), so if the word
you need to look for is very long, the search might take a few seconds. To keep the UI responsive while the search is going on, the search is done
by a separate Web worker which was also a first for me.

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).

## Available Scripts

In the project directory, you can run:

### `yarn start`

Runs the app in the development mode.<br />
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.<br />
You will also see any lint errors in the console.

### `yarn test`

Launches the test runner in the interactive watch mode.<br />
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.
