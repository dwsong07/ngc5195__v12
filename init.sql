CREATE TABLE warned(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    count INTEGER NOT NULL,
    reason TEXT
);

CREATE TABLE muted(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    expire_time TEXT,
    reason TEXT
);