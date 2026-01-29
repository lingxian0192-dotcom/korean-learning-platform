-- Allow admins to update any resource
CREATE POLICY resources_update_admin ON resources 
FOR UPDATE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);

-- Allow admins to delete any resource
CREATE POLICY resources_delete_admin ON resources 
FOR DELETE TO authenticated 
USING (
  EXISTS (
    SELECT 1 FROM users 
    WHERE users.id = auth.uid() 
    AND users.role = 'admin'
  )
);
