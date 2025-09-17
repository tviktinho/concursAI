#!/usr/bin/env node

// Cria um usuario de teste via endpoint /signup

const DEFAULT_API = process.env.API_URL || 'http://localhost:4000'
const apiBase = process.argv[2] || DEFAULT_API

async function ensureTestUser() {
  const payload = {
    name: 'Usuario Teste',
    email: 'teste+concursando@example.com',
    username: 'teste',
    password: 'teste',
    consents: {
      essential: true,
      terms: true,
      privacy: true,
      performance: true,
      personalization: true,
      marketing: false,
      analytics: true,
    },
    gdprCompliance: {
      accepted: true,
      acceptedAt: new Date().toISOString(),
      ip: '127.0.0.1',
      userAgent: 'create-test-user-script',
    },
  }

  const response = await fetch(`${apiBase}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (response.ok) {
    console.log(`Usuario de teste criado/atualizado com sucesso em ${apiBase}.`)
    return
  }

  const text = await response.text()
  if (response.status === 409 || text.includes('ja existe')) {
    console.log('Usuario de teste ja existe. Nada a fazer.')
    return
  }
  throw new Error(`Falha ao criar usuario de teste (${response.status}): ${text}`)
}

ensureTestUser().catch((err) => {
  console.error(err.message || err)
  process.exit(1)
})

