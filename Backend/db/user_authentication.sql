CREATE TABLE IF NOT EXISTS user_authentication (
    authentication_token VARCHAR(64) PRIMARY KEY,
    user_id UUID,
    FOREIGN KEY (user_id) REFERENCES users(id)
);