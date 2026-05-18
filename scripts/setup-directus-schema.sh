#!/bin/bash
# Erstellt die booking_inquiries Collection in Directus.
# Einmalig ausführen nach dem ersten Start von Directus.
#
# Usage: bash scripts/setup-directus-schema.sh
#
# Voraussetzung: DIRECTUS_URL und DIRECTUS_TOKEN in .env.prod gesetzt.

set -e

ENV_FILE="/srv/novi-tattoo/.env.prod"
if [ ! -f "$ENV_FILE" ]; then
  echo "❌ $ENV_FILE nicht gefunden."
  exit 1
fi

source "$ENV_FILE"

BASE_URL="${DIRECTUS_URL:-http://localhost:8055}"
TOKEN="$DIRECTUS_TOKEN"

if [ -z "$TOKEN" ]; then
  echo "❌ DIRECTUS_TOKEN fehlt in $ENV_FILE"
  exit 1
fi

echo "→ Verbinde mit Directus: $BASE_URL"

# ── Collection anlegen ────────────────────────────────────────────────────────
echo "→ Erstelle Collection booking_inquiries..."
curl -sf -X POST "$BASE_URL/collections" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "collection": "booking_inquiries",
    "meta": {
      "icon": "calendar",
      "note": "Buchungsanfragen vom Website-Formular",
      "display_template": "{{name}} – {{style}}",
      "sort_field": "date_created"
    },
    "schema": {}
  }' > /dev/null && echo "  ✓ Collection erstellt" || echo "  ℹ Collection existiert bereits"

# ── Felder anlegen ────────────────────────────────────────────────────────────
create_field() {
  local field="$1"
  local payload="$2"
  curl -sf -X POST "$BASE_URL/fields/booking_inquiries" \
    -H "Authorization: Bearer $TOKEN" \
    -H "Content-Type: application/json" \
    -d "$payload" > /dev/null && echo "  ✓ $field" || echo "  ℹ $field (existiert bereits)"
}

echo "→ Erstelle Felder..."

create_field "status" '{
  "field": "status",
  "type": "string",
  "meta": { "interface": "select-dropdown", "options": { "choices": [
    {"text": "Neu", "value": "new"},
    {"text": "In Bearbeitung", "value": "in_progress"},
    {"text": "Bestätigt", "value": "confirmed"},
    {"text": "Abgelehnt", "value": "rejected"}
  ]}, "display": "labels", "width": "half" },
  "schema": { "default_value": "new", "is_nullable": false }
}'

create_field "name" '{
  "field": "name",
  "type": "string",
  "meta": { "interface": "input", "width": "half" },
  "schema": { "is_nullable": false }
}'

create_field "email" '{
  "field": "email",
  "type": "string",
  "meta": { "interface": "input", "width": "half" },
  "schema": { "is_nullable": false }
}'

create_field "instagram" '{
  "field": "instagram",
  "type": "string",
  "meta": { "interface": "input", "width": "half" },
  "schema": { "is_nullable": true }
}'

create_field "age_confirmed" '{
  "field": "age_confirmed",
  "type": "boolean",
  "meta": { "interface": "boolean", "width": "half" },
  "schema": { "default_value": false, "is_nullable": false }
}'

create_field "style" '{
  "field": "style",
  "type": "string",
  "meta": { "interface": "input", "width": "half" },
  "schema": { "is_nullable": true }
}'

create_field "placement" '{
  "field": "placement",
  "type": "string",
  "meta": { "interface": "input", "width": "half" },
  "schema": { "is_nullable": true }
}'

create_field "placement_ids" '{
  "field": "placement_ids",
  "type": "json",
  "meta": { "interface": "input-code", "width": "half" },
  "schema": { "is_nullable": true }
}'

create_field "size_cm" '{
  "field": "size_cm",
  "type": "float",
  "meta": { "interface": "input", "width": "half" },
  "schema": { "is_nullable": true }
}'

create_field "concept" '{
  "field": "concept",
  "type": "text",
  "meta": { "interface": "input-multiline", "width": "full" },
  "schema": { "is_nullable": true }
}'

create_field "reference_images" '{
  "field": "reference_images",
  "type": "json",
  "meta": { "interface": "input-code", "width": "half", "note": "Array von Directus File-UUIDs" },
  "schema": { "is_nullable": true }
}'

create_field "skin_photo" '{
  "field": "skin_photo",
  "type": "string",
  "meta": { "interface": "input", "width": "half", "note": "Directus File-UUID" },
  "schema": { "is_nullable": true }
}'

echo ""
echo "✅ Schema-Setup abgeschlossen."
echo "   Öffne $BASE_URL/admin um die Collection zu sehen."
