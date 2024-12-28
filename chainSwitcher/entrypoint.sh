#!/bin/bash
# Generate configuration files from environment variables and start processes
set -e

chainSwitcher.php >/tmp/config.json
exec chainSwitcher -config /tmp/config.json "$@"
