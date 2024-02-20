#!/bin/bash

# Creates a user and a database in PostgreSQL
# Usage: setup-db.sh [username] [database]
# If no arguments are provided, default values are used
#   Default username: csye6225
#   Default database: Cloud


# Check if sudo is available
if ! sudo -v >/dev/null 2>&1; then
   echo "Installation requires sudo permissions" 
   exit 1
fi

echo "Creating user and database"

# Check if arguments are provided, otherwise assign default values
username=${1:-csye6225}
database=${2:-Cloud}

# Check if user exists, otherwise create it
if ! sudo -Hiu postgres psql -c "SELECT 1 FROM pg_roles WHERE rolname='$username'" | grep -q 1; then
    sudo -Hiu postgres psql -qc "CREATE USER $username;"
    echo  "User '$username' successfully created."
else
    echo "User '$username' already exists. Skipping creation."
fi

# Check if database exists, otherwise create it
if ! sudo -Hiu postgres psql -lqt | cut -d \| -f 1 | grep -qc "$database"; then
    sudo -Hiu postgres createdb "$database"
    echo  "Database '$database' successfully created."
else
    echo "Database '$database' already exists. Skipping creation."
fi

# Grant all privileges & ownership to the user on the database
sudo -Hiu postgres psql -qc 'GRANT ALL PRIVILEGES ON DATABASE "'"$database"'" TO '"$username"';'
sudo -Hiu postgres psql -qc 'ALTER DATABASE "'"$database"'" OWNER TO '"$username"';'

echo "User '$username' granted all privileges on database '$database'"
