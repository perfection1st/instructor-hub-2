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

-- Fake Data
INSERT INTO cohorts (
    cohort_name,
    begin_date,
    end_date,
    instructor
  )
VALUES (
    'MCSP-13',
    '01/01/2022',
    '04/04/2022',
    'testuser'
  ), (
    'MCSP-15',
    '01/01/2022',
    '04/04/2022',
    'Danny'
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
    '100',
    '100',
    'MCSP-13',
    '12/31/2022',
    'bronzedog'
), ('Lucas Tousignant',
    'pass',
    'pass',
    '90',
    '90',
    'MCSP-13',
    '12/31/2022',
    'lucas_tucas'), 
    ('Aakash Begosh',
    'pass',
    'pass',
    '95',
    '95',
    'MCSP-13',
    '12/31/2022',
    'a_is_for_aakash')
    , ('Matt Brooks',
    'pass',
    'pass',
    '90',
    '90',
    'MCSP-15',
    '12/31/2022',
    'matty_ice')
    , ('Jose Larrahondo',
    'pass',
    'pass',
    '96',
    '96',
    'MCSP-15',
    '12/31/2022',
    'big_papi')
