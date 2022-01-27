# final-project-study-group-finder

# Installation/Usage

Clone this repository to your computer using git and `cd` into it.
## Installation/Usage
- ## Front-end 

    - First `cd` into the front-end directory and then run `npm install` to install all of the front-end's dependencies.
    
        - After doing that, here is a list of useful commands:

          - `npm start` 
            - Starts the development server which is listening for connections [here](http://localhost:3000/)

          - `npm run build`
            - Bundles the app into static files for production

          - `npm test`
            - Starts the test runner

# Stlying Guidelines 

- ## Front-end 

    - Use the VSCode Editor with the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension to automatically format the code according to the style guildine specified by [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb). You can enable Prettier to automaticallt format by going to Prettier's Extension settings VSCode and enable "Format on save".

## Contribution
We have two primary branches: 
  - **dev**
    - This is the branch that any contributors need to branch off of to create feature branches.
    - When you want to merge your feature branch back into **dev**:
      - Submit a pull request with the template found in doc/pull-request-template.md
      - Ensure you get at least one person to review your changes before merging into the dev branch.
  - **prod**
    - This is the branch that that contains the code used in production (ie the live product).
    - Merging into this branch is to ONLY be done at the end of each sprint.
