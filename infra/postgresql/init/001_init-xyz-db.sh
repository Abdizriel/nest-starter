#!/bin/bash
set -e

psql -v ON_ERROR_STOP=1 --username "$POSTGRES_USER" --dbname "$POSTGRES_DB" <<-EOSQL
    CREATE USER admin WITH PASSWORD 'password';

    CREATE DATABASE xyz;
    GRANT ALL PRIVILEGES ON DATABASE xyz TO admin;
EOSQL