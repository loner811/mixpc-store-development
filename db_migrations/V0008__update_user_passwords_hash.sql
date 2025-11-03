-- Обновление паролей существующих пользователей (SHA256 хеш для '123')
UPDATE t_p58610579_mixpc_store_developm.users 
SET password_hash = 'a665a45920422f9d417e4867efdc4fb8a04a1f3fff1fa07e998e86f7f7a27ae3'
WHERE username IN ('admin', 'login');
