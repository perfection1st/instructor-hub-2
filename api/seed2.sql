INSERT INTO cohorts (
    cohort_name,
    begin_date,
    end_date,
    instructor,
    gid
  )
VALUES (
    'MCSP13',
    '01/01/2022',
    '04/04/2022',
    'testuser',
    '100'
  );

INSERT INTO students (
    gid,
    name,
    learn_avg,
    tech_avg,
    teamwork_avg,
    server_side_test,
    client_side_test,
    cohort_name,
    ETS_date,
    github
  )
VALUES (
    '123456',
    'John Testor',
    '80',
    '2',
    '1',
    'pass',
    'pass',
    'MCSP13',
    '12/31/2022',
    'bronzedog'
);