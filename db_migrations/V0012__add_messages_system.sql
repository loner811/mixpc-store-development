-- Добавляем user_id в contact_messages
ALTER TABLE t_p58610579_mixpc_store_developm.contact_messages 
ADD COLUMN IF NOT EXISTS user_id INTEGER REFERENCES t_p58610579_mixpc_store_developm.users(id);

-- Создаем таблицу для ответов админа
CREATE TABLE IF NOT EXISTS t_p58610579_mixpc_store_developm.message_replies (
    id SERIAL PRIMARY KEY,
    message_id INTEGER NOT NULL REFERENCES t_p58610579_mixpc_store_developm.contact_messages(id),
    reply_text TEXT NOT NULL,
    admin_name VARCHAR(255) DEFAULT 'Администратор',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Создаем индексы для быстрого поиска
CREATE INDEX IF NOT EXISTS idx_contact_messages_user_id ON t_p58610579_mixpc_store_developm.contact_messages(user_id);
CREATE INDEX IF NOT EXISTS idx_message_replies_message_id ON t_p58610579_mixpc_store_developm.message_replies(message_id);