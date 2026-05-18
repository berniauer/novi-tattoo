#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────────
# VPS First-Time Setup — einmalig ausführen als root oder sudo-User
#
# Voraussetzungen:
#   - Frischer VPS (Debian 12 / Ubuntu 24.04)
#   - Tailscale bereits installiert & verbunden
#   - GitHub Repo: https://github.com/berniauer/novi-tattoo
#
# Ausführen:
#   curl -fsSL https://raw.githubusercontent.com/berniauer/novi-tattoo/main/scripts/vps-first-setup.sh | bash
# ─────────────────────────────────────────────────────────────────────────────
set -euo pipefail

echo "🚀 Novi Tattoo — VPS Setup"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 1. System-Updates ─────────────────────────────────────────────────────────
echo "📦 System updaten..."
apt-get update -qq && apt-get upgrade -y -qq

# ── 2. Docker installieren ────────────────────────────────────────────────────
if ! command -v docker &> /dev/null; then
  echo "🐳 Docker installieren..."
  curl -fsSL https://get.docker.com | sh
  systemctl enable --now docker
  echo "✅ Docker installiert: $(docker --version)"
else
  echo "✅ Docker bereits vorhanden: $(docker --version)"
fi

# ── 3. Deployment-Verzeichnis anlegen ─────────────────────────────────────────
APP_DIR="/opt/novi-tattoo"
echo "📁 App-Verzeichnis: $APP_DIR"

if [ ! -d "$APP_DIR" ]; then
  git clone https://github.com/berniauer/novi-tattoo.git "$APP_DIR"
else
  echo "   Verzeichnis existiert bereits, überspringe clone."
fi

cd "$APP_DIR"

# ── 4. .env-Dateien anlegen (falls nicht vorhanden) ───────────────────────────
if [ ! -f ".env.prod" ]; then
  cp .env.example .env.prod
  echo ""
  echo "⚠️  WICHTIG: Fülle jetzt .env.prod aus:"
  echo "   nano /opt/novi-tattoo/.env.prod"
  echo ""
fi

if [ ! -f ".env.directus" ]; then
  cp .env.example .env.directus
  echo "⚠️  WICHTIG: Fülle jetzt .env.directus aus:"
  echo "   nano /opt/novi-tattoo/.env.directus"
  echo ""
fi

# ── 5. GitHub Container Registry Login ───────────────────────────────────────
echo ""
echo "🔑 GitHub Container Registry (GHCR) Login"
echo "   Du brauchst einen GitHub PAT mit 'read:packages' Scope."
echo "   Erstellen unter: https://github.com/settings/tokens/new"
echo ""
read -rp "   GitHub Username: " GH_USER
read -rsp "  GitHub PAT (read:packages): " GH_TOKEN
echo ""
echo "$GH_TOKEN" | docker login ghcr.io -u "$GH_USER" --password-stdin
echo "✅ Bei GHCR eingeloggt."

# ── 6. SSH Deploy-Key für GitHub Actions anlegen ──────────────────────────────
KEY_PATH="/root/.ssh/github_actions_deploy"

if [ ! -f "$KEY_PATH" ]; then
  echo ""
  echo "🔐 SSH Deploy-Key generieren..."
  ssh-keygen -t ed25519 -C "github-actions-deploy" -f "$KEY_PATH" -N ""
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 ÖFFENTLICHER KEY — in authorized_keys eintragen:"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "${KEY_PATH}.pub"
  echo ""
  cat "${KEY_PATH}.pub" >> /root/.ssh/authorized_keys
  chmod 600 /root/.ssh/authorized_keys
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  echo "📋 PRIVATER KEY — als Secret 'VPS_SSH_KEY' in GitHub eintragen:"
  echo "   https://github.com/berniauer/novi-tattoo/settings/secrets/actions"
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
  cat "$KEY_PATH"
  echo ""
  echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
fi

# ── 7. Tailscale-IP ausgeben ──────────────────────────────────────────────────
TAILSCALE_IP=$(tailscale ip -4 2>/dev/null || echo "Tailscale nicht aktiv")
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "📋 GitHub Secrets die du noch setzen musst:"
echo "   https://github.com/berniauer/novi-tattoo/settings/secrets/actions"
echo ""
echo "   VPS_HOST     → $TAILSCALE_IP"
echo "   VPS_USER     → $(whoami)"
echo "   VPS_SSH_KEY  → (privater Key, oben angezeigt)"
echo ""
echo "   TS_OAUTH_CLIENT_ID  → https://login.tailscale.com/admin/settings/oauth"
echo "   TS_OAUTH_SECRET     → (selbe Seite)"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# ── 8. Stack starten ──────────────────────────────────────────────────────────
echo ""
read -rp "Stack jetzt starten? (docker compose -f docker-compose.prod.yml up -d) [j/N] " START
if [[ "$START" =~ ^[Jj]$ ]]; then
  docker compose -f docker-compose.prod.yml up -d
  echo ""
  echo "✅ Stack läuft. Status:"
  docker compose -f docker-compose.prod.yml ps
fi

echo ""
echo "🎉 Setup abgeschlossen!"
