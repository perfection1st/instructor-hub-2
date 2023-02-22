/* ============================================================
-- TESTING(FAKE) DATA
============================================================== */

--INSERT INTO USERS
-- Test of users password MD5 hash
INSERT INTO users (
    username,
    password,
    default_cohort,
    token
  )
VALUES (
    'testuser',
    crypt('12345', gen_salt('bf')),
    'MCSP13',
    'here_goes_an_token'
  );

  INSERT INTO users (
    username,
    password,
    default_cohort,
    token
  )
VALUES (
    'Mr. Egg',
    crypt('password', gen_salt('bf')),
    'MCSP15',
    'heres_another_token'
  );

  INSERT INTO users (
    username,
    password,
    default_cohort,
    token
  )
VALUES (
    'a',
    crypt('a', gen_salt('bf')),
    'MCSP13',
    'heres_yet another_token'
  );

-- Fake Data
INSERT INTO cohorts (
    cohort_name,
    begin_date,
    end_date,
    instructor
  )
VALUES (
    'MCSP13',
    '01/01/2022',
    '04/04/2022',
    'testuser'
  );
-- Fake Data
INSERT INTO students (
    name,
    server_side_test,
    client_side_test,
    tech_avg,
    teamwork_avg,
    cohort_name,
    ETS_date,
    github
  )
VALUES (
    'John Testor',
    'pass',
    'pass',
    '3',
    '2',
    'MCSP13',
    '12/31/2022',
    'bronzedog'
  );
