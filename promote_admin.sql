-- Update the user role to admin
UPDATE users
SET role = 'admin'
WHERE name = 'LingXian';

-- Verify the update
SELECT id, name, email, role FROM users WHERE name = 'LingXian';
