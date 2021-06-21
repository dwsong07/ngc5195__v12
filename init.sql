CREATE TABLE warned(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    timestamp TEXT NOT NULL,
    count INTEGER NOT NULL,
    reason TEXT
);

CREATE TABLE muted(
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    timestmap TEXT NOT NULL,
    expire_time TEXT,
    reason TEXT
);