-- Clean the slate
DROP TABLE IF EXISTS students CASCADE;
DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS cohorts CASCADE;
DROP TABLE IF EXISTS coding_groups CASCADE;
DROP TABLE IF EXISTS notes CASCADE;
DROP TABLE IF EXISTS projects CASCADE;
DROP TABLE IF EXISTS learn CASCADE;
DROP TABLE IF EXISTS project_grades CASCADE;
DROP TABLE IF EXISTS learn_grades CASCADE;
DROP TABLE IF EXISTS assigned_student_groupings CASCADE;
DROP TABLE IF EXISTS pairs CASCADE;
DROP TABLE IF EXISTS proficiency_rates CASCADE;
DROP TABLE IF EXISTS student_teamwork_skills CASCADE;
DROP TABLE IF EXISTS student_tech_skills CASCADE;
DROP FUNCTION IF EXISTS calc_projavg() CASCADE;
DROP TRIGGER IF EXISTS project ON project_grades CASCADE;
DROP TRIGGER IF EXISTS cohortavg ON students CASCADE;
DROP TRIGGER IF EXISTS trig_student_copy on students CASCADE;
DROP TRIGGER IF EXISTS trig_cohort_copy ON cohorts CASCADE;

DROP EXTENSION IF EXISTS pgcrypto;

CREATE EXTENSION pgcrypto;

--TABLE OF CONTENTS--
--SECTION 1: TABLES AND RELATIONS
------ (1) users
------ (2) cohorts
------ (3) students
------ (4) coding_groups
------ (5) assigned_student_groupings
------ (6) notes
------ (7) proficiency_rates
------ (8) student_tech_skills
------ (9) student_teamwork_skills
------ (10) projects
------ (11) project_grades
------ (12) learn
------ (13) learn_grades
--SECTION 2: FUNCTIONS AND TRIGGERS
------ (1) calc_techavg()
------ (2) calc_teamwrkavg()
------ (3) calc_learnavg()
------ (4) calc_cohortmin()
------ (5) calc_cohortmax()
------ (6) calc_cohortavg()



/* ============================================================
-- SECTION 1: Create tables and relations
============================================================== */
  CREATE TABLE users (
  user_id SERIAL PRIMARY KEY,
  username VARCHAR (50) UNIQUE,
  password TEXT NOT NULL,
  default_cohort TEXT,
  asana_access_token TEXT,
  gid TEXT
);

CREATE TABLE cohorts (
  cohort_id SERIAL PRIMARY KEY,
  name TEXT,
  begin_date DATE,
  end_date DATE,
  instructor TEXT,
  cohort_avg INT,
  cohort_min INT,
  cohort_max INT,
  gid TEXT
);

CREATE TABLE students (
  student_id SERIAL PRIMARY KEY,
  name TEXT,
  learn_avg INT,
  tech_avg INT,
  teamwork_avg INT,
  server_side_test TEXT,
  client_side_test TEXT,
  cohort TEXT,
  cohort_id INT,
  ETS_date DATE,
  github TEXT,
  gid TEXT,
  FOREIGN KEY (cohort_id) REFERENCES cohorts(cohort_id) ON DELETE CASCADE
  );

--THIS ENABLES TRACKING OF STUDENT CODING PAIR/GROUP ASSIGNMENTS
CREATE TABLE coding_groups (
  group_id SERIAL PRIMARY KEY,
  cohort_id INT,
  FOREIGN KEY (cohort_id) REFERENCES cohorts(cohort_id) ON DELETE CASCADE
);

CREATE TABLE assigned_student_groupings (
  group_assignment_id SERIAL PRIMARY KEY,
  student_id INT,
  group_id INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (group_id) REFERENCES coding_groups(group_id) ON DELETE CASCADE
);

CREATE TABLE notes (
  student_id INT,
  note_id SERIAL PRIMARY KEY,
  notes TEXT,
  name TEXT,
  note_date TIMESTAMPTZ,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE
);

CREATE TABLE proficiency_rates (
  skill_id INT UNIQUE,
  skill_descr TEXT NOT NULL
);

CREATE TABLE student_tech_skills (
  student_id INT,
  score INT,
  record_date TIMESTAMPTZ,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (score) REFERENCES proficiency_rates(skill_id) ON DELETE RESTRICT
);

  CREATE TABLE student_teamwork_skills (
    student_id INT,
    score INT,
    record_date TIMESTAMPTZ,
    FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
    FOREIGN KEY (score) REFERENCES proficiency_rates(skill_id) ON DELETE RESTRICT
  );

--THIS ALLOWS TRACKIJNG STUDENTS' PROJECT RATINGS/SCORES
CREATE TABLE projects (
  project_id SERIAL PRIMARY KEY,
  project_name TEXT,
  gid TEXT
);

CREATE TABLE project_grades (
  project_grades_id SERIAL PRIMARY KEY,
  student_id INT,
  project_id INT,
  project_passed BOOLEAN,
  notes TEXT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (project_id) REFERENCES projects(project_id) ON DELETE RESTRICT
  --removes learn grades if student is deleted. Cannot delete projects without deleting grades first
);
----this index ensures students don't have duplicate grades
CREATE UNIQUE INDEX project_grades_only_one_per_student
    ON project_grades (student_id, project_id);

CREATE TABLE learn (
  assessment_id SERIAL PRIMARY KEY,
  assessment_name TEXT
);

CREATE TABLE learn_grades (
  learn_grade_id SERIAL PRIMARY KEY,
  student_id INT,
  assessment_id INT,
  assessment_grade INT,
  FOREIGN KEY (student_id) REFERENCES students(student_id) ON DELETE CASCADE,
  FOREIGN KEY (assessment_id) REFERENCES learn(assessment_id) ON DELETE RESTRICT
  --removes learn grades if student is deleted. Cannot delete assessments without deleting grades first

);
----this index ensures students don't have duplicate grades
CREATE UNIQUE INDEX learn_grades_only_one_per_student
    ON learn_grades (student_id, assessment_id);



/* ============================================================
-- SECTION 2: FUNCTIONS AND TRIGGERS
============================================================== */
--- (1) UPDATE STUDENT'S TECH SKILLS AVG WHEN NEW SCORE IS ADDED OR UPDATED.
----FUNCTION: UPDATE STUDENT'S TECH AVG SCORE
CREATE OR REPLACE FUNCTION calc_techavg() RETURNS trigger AS $$ BEGIN WITH scores AS (
    SELECT AVG(student_tech_skills.score) as avg
    FROM student_tech_skills
    WHERE student_id = NEW.student_id
  )
UPDATE students
SET tech_avg = scores.avg
FROM scores
WHERE student_id = NEW.student_id;
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
----TRIGGER: RUNS WHEN STUDENT'S GRADE IS ADDED OR UPDATED
CREATE TRIGGER tech_skills_trigger
AFTER
INSERT
  OR
UPDATE ON student_tech_skills FOR EACH ROW EXECUTE PROCEDURE calc_techavg();


--- (2) UPDATE STUDENT'S TEAMWORK SKILLS AVG WHEN NEW SCORE IS ADDED OR UPDATED.
---- FUNCTION: UPDATE STUDENT'S TEAMWORK AVG SCORE
CREATE OR REPLACE FUNCTION calc_teamwrkavg() RETURNS trigger AS $$ BEGIN WITH scores AS (
    SELECT AVG(student_teamwork_skills.score) as avg
    FROM student_teamwork_skills
    WHERE student_id = NEW.student_id
  )
UPDATE students
SET teamwork_avg = scores.avg
FROM scores
WHERE student_id = NEW.student_id;
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
---- TRIGGER: RUNS WHEN STUDENT'S GRADE IS ADDED OR UPDATED
CREATE TRIGGER teamwrk_skills_trigger
AFTER
INSERT
  OR
UPDATE ON student_teamwork_skills FOR EACH ROW EXECUTE PROCEDURE calc_teamwrkavg();


--- (3) UPDATE STUDENT'S LEARN AVG WHEN NEW GRADE IS ADDED OR UPDATED TO LEARN.
-- FUNCTION: UPDATE STUDENT'S LEARN AVG SCORE
CREATE OR REPLACE FUNCTION calc_learnavg() RETURNS trigger AS $$ BEGIN WITH grades AS (
    SELECT AVG(learn_grades.assessment_grade) as avg
    FROM learn_grades
    WHERE student_id = NEW.student_id
  )
UPDATE students
SET learn_avg = grades.avg
FROM grades
WHERE student_id = NEW.student_id;
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
-- TRIGGER: RUNS WHEN STUDENT'S GRADE IS ADDED OR UPDATED
CREATE TRIGGER learn
AFTER
INSERT
  OR
UPDATE OF assessment_grade ON learn_grades FOR EACH ROW EXECUTE PROCEDURE calc_learnavg();


--- (4)  UPDATE COHORT'S LOWEST ASSESSMENT AVERAGE WHEN STUDENT'S LEARN AVERAGE IS ADDED OR UPDATED.
-- FUNCTION:UPDATE COHORT LOWEST AVG SCORE
CREATE OR REPLACE FUNCTION calc_cohortmin() RETURNS trigger AS $$ BEGIN WITH grades AS (
    SELECT MIN(students.learn_avg) as min
    FROM students
    WHERE cohort_id = NEW.cohort_id
  )
UPDATE cohorts
SET cohort_min = grades.min
FROM grades
WHERE cohort_id = new.cohort_id;
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
-- TRIGGER: RUNS WHEN STUDENT'S LEARN AVERAGE IS ADDED OR UPDATED
CREATE TRIGGER cohortmin
AFTER
INSERT
  OR
UPDATE of learn_avg ON students FOR EACH ROW EXECUTE PROCEDURE calc_cohortmin();


--- (5)  UPDATE COHORT'S HIGHEST ASSESSMENT AVERAGE WHEN STUDENT'S LEARN AVERAGE IS ADDED OR UPDATED.
-- FUNCTION:UPDATE COHORT HIGHEST AVG SCORE
CREATE OR REPLACE FUNCTION calc_cohortmax() RETURNS trigger AS $$ BEGIN WITH grades AS (
    SELECT MAX(students.learn_avg) as max
    FROM students
    WHERE cohort_id = new.cohort_id
  )
UPDATE cohorts
SET cohort_max = grades.max
FROM grades
WHERE cohort_id = new.cohort_id;
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
-- TRIGGER: RUNS WHEN STUDENT'S LEARN AVERAGE IS ADDED OR UPDATED
CREATE TRIGGER cohortmax
AFTER
UPDATE of learn_avg ON students FOR EACH ROW EXECUTE PROCEDURE calc_cohortmax();

-- Update cohort avg
--- (6)  UPDATE THE OVERALL AVERAGE OF STUDENT'S ASSESSMENT-AVERAGES FOR THE COHORT WHEN
---      STUDENT'S LEARN AVERAGE IS ADDED OR UPDATED.
-- FUNCTION:UPDATE COHORT OVERALL AVG SCORE
CREATE OR REPLACE FUNCTION calc_cohortavg() RETURNS trigger AS $$ BEGIN WITH grades AS (
    SELECT AVG(students.learn_avg) as avg
    FROM students
    WHERE cohort_id = new.cohort_id
  )
UPDATE cohorts
SET cohort_avg = grades.avg
FROM grades
WHERE cohort_id = new.cohort_id;
RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';
-- TRIGGER: RUNS WHEN STUDENT'S LEARN AVERAGE IS ADDED OR UPDATED
CREATE TRIGGER cohortavg
AFTER
UPDATE of learn_avg ON students FOR EACH ROW EXECUTE PROCEDURE calc_cohortavg();


/* ============================================================
-- Load Proficiency Ratings
============================================================== */
INSERT INTO proficiency_rates (skill_id, skill_descr)
VALUES('1', 'Needs improvement');
INSERT INTO proficiency_rates (skill_id, skill_descr)
VALUES('2', 'Approaching standard');
INSERT INTO proficiency_rates (skill_id, skill_descr)
VALUES('3', 'Meets standard');
INSERT INTO proficiency_rates (skill_id, skill_descr)
VALUES('4', 'Exceeds standard');


-- Database statistics collector:
-- SELECT * FROM pg_stat_activity

-- Linear Regression to see if learn scores are predictive of tech skills for a cohort.
-- The closer R^2 is to 1, the stronger the predictive power
-- SELECT regr_r2(learn_avg, tech_skills) as r2_learn_tech FROM students