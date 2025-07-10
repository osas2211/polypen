# Polypen

**Live demo:** https://polypen.vercel.app/

Polypen is a collaborative, AI-powered document editor that translates and reframes your text in real time for different audiences, and then mints each finished document as its own “coin” on Zora’s Base Sepolia testnet. I store user and document metadata in Tableland, pin document metadata JSON to IPFS via Pinata, and surface on-chain token analytics via the Zora Coins SDK and React-Query hooks. All blockchain writes happen in the user’s browser, no server-side signer required.

---

## Features

- **Real-time Multilingual Translation**  
  As you type in our Next.js + TinyMCE editor, your content is translated on-the-fly into each reader’s preferred language.

- **Intent Rewriting**  
  A secondary AI layer reframes the same content to suit different personas (developer, poet, doctor, etc.).

- **Collaborative Editing**  
  Multiple users can edit the same document; only the author can invite collaborators or delete the document.

- **IPFS-backed Metadata**  
  I pin document metadata (title, excerpt, author, timestamp, tags) to IPFS via Pinata and reference it with an `ipfs://` URI.

- **Zora Coin Minting**  
  In-browser MetaMask integration deploys a bespoke ERC-20 token per document on Base Sepolia. The deployed `coinAddress` doubles as the document ID and its trading handle (`https://testnet.zora.co/coin/bsep:<coinAddress>`).

- **Tableland Storage**  
  User profiles and document records, including the Zora `coinAddress` as each document’s primary key, live in decentralized Tableland tables.

- **Live On-chain Analytics**  
  Supply, market cap, volume, top gainers, and holder lists are fetched via Zora’s GraphQL APIs and delivered through React-Query hooks (`useCoinDetails`, `useCoinHolders`, `useTopGainers`, `useTopVolume`).

- **Zero Server-Side Signer**  
  All blockchain interactions use the user’s MetaMask signer; our server exposes only read-only API routes and keeps secrets safe.

---

## Architecture Overview

```
Browser
 ├─ WalletContext        (Ethers + Viem custom transport)
 ├─ Zora Coins SDK      → Base Sepolia
 ├─ React-Query Hooks:
 │    • Tableland: useUsers, useDocuments, useCreateDocument, useInviteCollaborator, etc.
 │    └─ Zora: useCreateCoinForDocument, useCoinDetails, useCoinHolders, useTopGainers, useTopVolume
 ├─ API Routes:
 │    • /api/ipfs-pinata  → pinJSONToIPFS via Pinata
 ├─ TinyMCE Editor → {
 │    • Real-time translation API
 │    • Intent rewriting API
 │ }
 └─ Tableland SDK       → user_profiles & documents tables

```

---

## Tech Stack

- **Next.js** (App Router, Server & Client Components)
- **@zoralabs/coins-sdk** for token minting(documents) and analytics
- **TinyMCE** for the rich-text editor
- **React-Query (TanStack Query)** for data fetching and mutations
- **ethers.js** & **viem** for wallet and RPC interactions
- **@tableland/sdk** for decentralized user & document storage
- **@pinata/sdk** for IPFS pinning of metadata JSON
- **OpenAI API** for translation and intent rewriting

---

## Quickstart

### 1. Clone & Install

```bash
git clone https://github.com/osas2211/polypen.git
cd polypen
npm install
```

### 2. Environment

Create a `.env.local` in the project root:

\`\`\`dotenv

# Tableland

NEXT_PUBLIC_USERS_TABLE=<your_user_profiles_table>
NEXT_PUBLIC_DOCUMENTS_TABLE=<your_documents_table>

# Zora & RPC

NEXT_PUBLIC_ZORA_API_KEY=<your_zora_api_key>
NEXT_PUBLIC_RPC_URL=https://base-sepolia.infura.io/v3/<your_infura_project_id>

# Pinata (server-side)

PINATA_API_KEY=<your_pinata_api_key>
PINATA_API_SECRET=<your_pinata_api_secret>

# AI Services

OPENAI_API_KEY=<your_openai_api_key>
\`\`\`

### 3. Run

```bash
npm run dev
```

Navigate to [http://localhost:3000](http://localhost:3000).

---

## Zora Coins Integration

1. **Pin Metadata**  
   Pin document metadata JSON via \`/api/ipfs-pinata\` (Pinata), obtain \`ipfs://<CID>\`.

2. **Mint Coin**  
    In a client-only React-Query mutation (\`useCreateCoinForDocument\`):

   - Ensure MetaMask is on Base Sepolia (chain ID 84532), prompt to switch/add if needed.
   - Call:
     \`\`\`ts
     createCoin(
     {
     name,
     symbol,
     uri, // ipfs://<CID>
     payoutRecipient, // author wallet
     chainId: 84532,
     initialPurchase: { currency: ETH, amount: BigInt("10000000000000000") }
     },
     walletClient,
     publicClient
     )
     \`\`\`
   - Receive \`{ txHash, coinAddress }\`.

3. **Document Record**  
   Use \`coinAddress\` as the document’s \`id\` in Tableland, creating the record with \`useCreateDocument\`.

4. **Analytics Hooks**
   - \`useCoinDetails(coinAddress)\` → supply, symbol, marketCap, volume24h, uniqueHolders
   - \`useCoinHolders(coinAddress)\` → list of current holders & balances
   - \`useTopGainers(count)\`, \`useTopVolume(count)\` → platform-wide token analytics

---

## Tableland Integration

- **User Profiles**  
  Stored in a Tableland table with fields:  
  \`wallet_address\`, \`name\`, \`role\`, \`bio\`, \`website\`, \`avatar\`, \`language\`, \`createdAt\`, plus an array of document metadata.

- **Documents**  
  Stored in Tableland with primary key \`id\` = Zora \`coinAddress\`, plus \`title\`, \`content\`, \`category\`, \`readTime\`, \`views\`, \`tokenSymbol\`, \`createdAt\`, \`author_wallet\`, \`collaborators\`, \`featured\`, \`gradient\`, \`tags\`, \`status\`.

- **Hooks**  
  \`useUsers\`, \`useUser\`, \`useDocuments\`, \`useDocument\`, \`useCreateDocument\`, \`useUpdateDocument\`, \`useDeleteDocument\`, \`useInviteCollaborator\`.

---

## Collaboration Workflow

- **Invite Collaborators**  
  Authors use a UI button to add collaborator wallet addresses; this updates Tableland.

- **Concurrent Editing**  
  All collaborators see and can edit in TinyMCE in real time; authors retain exclusive invite/delete rights.

---

## Future Goals

1. **UX Polish**: Complete mobile responsiveness, refine error states, build persona-template UI.
2. **Security**: Smart-contract testing/audit, rate-limit & cache IPFS pins, strengthen collaborator access controls.
3. **Growth**: Partner with other Web3 editors (Mirror, Ceramic), build author dashboards for token analytics, explore royalties & tipping via tokenomics.

---

## License

MIT © Osaretin Frank / Osas2211
