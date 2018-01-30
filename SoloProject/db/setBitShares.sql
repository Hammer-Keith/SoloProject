UPDATE users SET bts_account = $2 WHERE id = $1 RETURNING bts_account;
