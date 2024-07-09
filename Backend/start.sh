#!/bin/bash

while true; do
    git pull
    npm install
    npx tsc
    node .
    exit_status=$?
    if [ $exit_status -eq 0 ]; then
        break
    fi
    echo "Cooking recipe suggester backend crashed with exit code $exit_status.  Respawning.." >&2
    sleep 1
done