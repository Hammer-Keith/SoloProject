UPDATE users SET bts_account = $2 WHERE id = $1;
SELECT *
FROM users
WHERE id = $1;