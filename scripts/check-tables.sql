-- List all tables and their columns in the public schema
WITH tables AS (
    SELECT table_name 
    FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_type = 'BASE TABLE'
)
SELECT 
    t.table_name,
    c.column_name,
    c.data_type,
    c.is_nullable,
    c.column_default,
    c.character_maximum_length
FROM tables t
JOIN information_schema.columns c 
    ON c.table_schema = 'public' 
    AND c.table_name = t.table_name
ORDER BY t.table_name, c.ordinal_position;
