CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(36) UNIQUE NOT NULL PRIMARY KEY,
    username VARCHAR(50) NOT NULL,
    hash VARCHAR(255) NOT NULL
);