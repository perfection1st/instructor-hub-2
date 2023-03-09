# Instructor Hub
This project uses the Asana API and requires an auth token to migrate data and information between the UI and Asana application.


## Installation:


1. To start Instructor Hub in a development environment first run `npm install` into the following:
    - root file
    - /server file
    - /src file

2. Run the following commands in the vscode terminal:

 `createdb blueocean`
 `psql -f database.sql blueocean`
 `psql -f seed.sql blueocean`


3. Create a `.env` file in the following format:

```

DB_name=blueocean

asanaPrivateToken=****Follow link below to obtain asana private token****

```

****Link to gain Asana private token****
https://app.asana.com/0/my-apps 


4. To start in a development environment use `npm run dev` in the root directory.



5. Login Information:

username: `testuser`
password: `12345`


### Asana Integration Functionalities

- Data migration between server and Asana Api. When adding a student on the UI the student will also be added onto the Asana app.
- When changing/adding a grade onto a student both UI and Asana will update the change
- Creating "notes" on a student will show on UI and Asana

#### UI functionalities

    Creating cohorts

- Naming and creating cohorts

    Adding students

- Add students and assigning them onto a cohort

    Updating progress and viewing progress report

- Assign assessment grades (DOM API, React, etc) onto a student
- Assign "pass or fail" on projects (Pixel ArtMaker, SDC, MVP, etc)
- Add scores in students technical (technical interviews, softskills, etc.)
- Create "notes" on each student 

    Viewing Reports of Student

- Click a student on the UI will display a summary of grades, notes, and scores assigned to that student

    Graph Progress

- Graph shows current progress of cohort as a whole, tallies the averages of each student in assesments, projects, and technical skills and shows how well the current cohort is doing

