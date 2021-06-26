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
    timestamp INTEGER NOT NULL,
    expire_time INTEGER,
    reason TEXT,
    removed_roles TEXT
);