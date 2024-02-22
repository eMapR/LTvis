#!/bin/bash
sqlite3 visDataRequests.db "create table requests(id integer primary key, name text, date text, data text, aoi text, email text)"
sqlite3 visDataRequests.db "INSERT INTO requests (id, name, date, data, aoi, email) VALUES (0, 'null', 'null', 'null', 'null', 'null');"
chmod 777 visDataRequests.db #note that the dir that holds this file needs to be writable by others