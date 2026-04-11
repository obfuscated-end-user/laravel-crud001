-- context
-- go to: C:\Users\Hello\Desktop\files\ZZZ_E_Drive\Projects\Laravel\laravel-crud

SELECT * FROM laravel_crud.users;
DESCRIBE laravel_crud.users;

SELECT * FROM laravel_crud.posts ORDER BY created_at DESC;
DESCRIBE laravel_crud.posts;

SELECT title, body FROM laravel_crud.posts WHERE user_id = 3;
SELECT body FROM laravel_crud.posts WHERE id = '510cadf2685bcaa';

-- DO NOT RUN, I ONLY USED THIS FOR FIXING ID COLUMN!
-- ALTER TABLE laravel_crud.posts ADD COLUMN id VARCHAR(15) PRIMARY KEY;
-- re-add id column as a string
ALTER TABLE laravel_crud.posts ADD COLUMN id VARCHAR(15);
-- randomly generate ids
UPDATE laravel_crud.posts SET id = SUBSTRING(MD5(RAND()), 1, 15);
-- add primary key constraint
ALTER TABLE laravel_crud.posts ADD PRIMARY KEY (id);
-- move it on leftmost side
ALTER TABLE laravel_crud.posts MODIFY COLUMN id VARCHAR(15) FIRST;