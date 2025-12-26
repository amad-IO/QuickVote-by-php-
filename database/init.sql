-- QuickVote Database Initialization
-- This file is automatically executed when MySQL container starts

CREATE DATABASE IF NOT EXISTS quickvote;
USE quickvote;

-- Create replication user for MySQL replication
-- This user will be used by replica servers to connect to master
CREATE USER IF NOT EXISTS 'repl'@'%' IDENTIFIED BY 'repl_password_123';
GRANT REPLICATION SLAVE ON *.* TO 'repl'@'%';

-- Grant privileges to main database user
GRANT ALL PRIVILEGES ON quickvote.* TO 'quickvote'@'%';
FLUSH PRIVILEGES;

-- Tables will be created by Laravel migrations