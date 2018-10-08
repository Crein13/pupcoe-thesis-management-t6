CREATE TABLE "admin" (
  "admin_id" SERIAL PRIMARY KEY,
  "fname" VARCHAR(100),
  "lname" VARCHAR(100),
  "email" VARCHAR(100),
  "password" VARCHAR(100),
  "user_type" VARCHAR(20),
  "is_admin" BOOLEAN,
  "phone" VARCHAR(100),
  "employee_id" VARCHAR(100),
  "student_number" VARCHAR(100)
);

CREATE TABLE "faculty" (
  "faculty_id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(80),
  "last_name" VARCHAR(80),
  "faculty_email" VARCHAR(100),
  "phone_number" VARCHAR(100),
  "password" VARCHAR(100)
);

CREATE TABLE "student" (
  "student_id" SERIAL PRIMARY KEY,
  "first_name" VARCHAR(80),
  "last_name" VARCHAR(80),
  "student_email" VARCHAR(100),
  "phone_number" VARCHAR(100),
  "password" VARCHAR(100)
);

CREATE TABLE "batches" (
  "batch_id" SERIAL PRIMARY KEY,
  "batches" INT
);

CREATE TABLE "class" (
  "class_id" SERIAL PRIMARY KEY,
  "batch_id" INT REFERENCES batches(id),
  "year_level_id" INT REFERENCES year_levels(id),
  "adviser_id" INT REFERENCES users(id),
  "section_id" INT REFERENCES sections(id)
);

CREATE TABLE "year_levels" (
  "id" SERIAL PRIMARY KEY,
  "year_levels" VARCHAR(20)
);

CREATE TABLE "sections" (
  "id" SERIAL PRIMARY KEY,
  "sections" INT
);

CREATE TABLE "users" (
  "id" SERIAL PRIMARY KEY,
  "admin_id" INT REFERENCES admin(admin_id),
  "faculty_id" INT REFERENCES faculty(faculty_id),
  "student_id" INT REFERENCES student(student_id),
  "class_id" INT REFERENCES class(class_id)
);
