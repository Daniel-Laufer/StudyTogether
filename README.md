# StudyTogether

Studying with others is an effective way of preparing for assessments, however it can be challenging to find others to study with at times. That’s where **StudyTogether** comes in to the rescue! 

**StudyTogether** is a web application that facilitates the process of forming study groups at a university. Users will be able to form their own study groups that others can then view and request to join. Users can easily filter through study groups using specific fields like dates, times, courses, topics, locations etc, and request to join the study group that’s perfect for them! 


# Installation/Usage

Begin by cloning this repository onto your computer by **git** and `cd` into it.
```bash
$ git clone https://github.com/UTSCCSCC01/finalprojectw22-studytogether.git my-app
$ cd my-app
```
## Front-end 

   - First `cd` into the front-end directory and then run `npm install` to install all of the front-end's dependencies.
    
        - After doing that, here is a list of useful commands:

          - `npm start` 
            - Starts the development server which is listening for connections [here](http://localhost:3000/)

          - `npm run build`
            - Bundles the app into static files for production

          - `npm test`
            - Starts the test runner
           
## Back-end 

### Installation
```bash
$ cd back-end
$ npm install #install all required packages
```

### Running the express-server

```bash
# development - port 3000
$ npm start 
```

### Database
Your **MongoDB Atlas** Database Uri should be stored in `.env`. An example of how the `.env` should  be is provided in `env.example`
```js
ATLAS_URI=mongodb+srv://TodSmith:passw0rd@cluster0....
```
Note: we temporarily have the .env file present in back-end/ directory of this repository with the raw value of the MongoDB atlas URI until we setup hosting for the back-end. We will remove the URI from this repository at that point.


# Styling Guidelines 

- ## Front-end 

    - Use the VSCode Editor with the [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode) extension to automatically format the code according to the style guideline specified by [eslint-config-airbnb](https://www.npmjs.com/package/eslint-config-airbnb). You can enable Prettier to automatically format by going to Prettier's Extension settings VSCode and enable "Format on save".

## Contribution
We have two primary branches: 
  - **dev**
    - This is the branch that any contributors need to branch off of to create feature branches.
    - When you want to merge your feature branch back into **dev**:
      - Submit a pull request with the template found in doc/pull-request-template.md
      - Ensure you get at least one person to review your changes before merging into the dev branch.
  - **prod**
    - This is the branch that that contains the code used in production (ie the live product).
    - Merging into this branch is to ONLY be done at the end of each sprint and will require al thorough review of the code by all members of the StudyTogether team.
    - 
