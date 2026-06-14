# 🚀 EngineerVerse

> **The All-in-One Platform for Engineering Students**

Learn skills, build projects, track progress, create portfolios, find teammates, prepare for interviews, practice viva, join hackathons, and get AI assistance — all in one place.

![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-4-06B6D4?logo=tailwindcss)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-336791?logo=postgresql)
![Prisma](https://img.shields.io/badge/Prisma-6-2D3748?logo=prisma)

---

## ✨ Features

### Phase 1 (Current)
- 🔐 **Authentication** — Email/password, GitHub, and Google OAuth
- 👤 **Student Profile** — Profile with skills, education, social links, completion tracking
- 📁 **Project Hub** — Upload, browse, like, comment, and fork projects
- 🏷️ **Tagging System** — Organize projects with searchable tags
- 📊 **Dashboard** — Overview of your activity and quick actions

### Coming Soon
- 🌳 **Skill Tree** — Gamified skill tracking with XP and levels
- 👥 **Team Finder** — Match with teammates for projects and hackathons
- 📝 **Viva Simulator** — Practice viva questions for core subjects
- 💼 **Placement Prep** — Aptitude, DSA, MCQs, mock interviews
- 🗺️ **Career Roadmaps** — Interactive guides for AI, Web Dev, DevOps
- 📄 **Portfolio Generator** — Auto-generate portfolio and resume
- 🤖 **AI Mentor** — Personalized learning plans and project suggestions

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | TailwindCSS 4 |
| Database | PostgreSQL + Prisma ORM |
| Auth | NextAuth.js v5 (Auth.js) |
| Validation | Zod |
| Icons | Lucide React |
| Deployment | Vercel + Railway |

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- PostgreSQL database
- GitHub/Google OAuth credentials (optional)

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/engineerverse.git
cd engineerverse

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env.local

# Update .env.local with your database URL and OAuth credentials

# Generate Prisma client
npx prisma generate

# Run database migrations
npx prisma db push

# Start development server
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `DATABASE_URL` | PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | Random secret for JWT signing | ✅ |
| `NEXTAUTH_URL` | Your app URL | ✅ |
| `GITHUB_CLIENT_ID` | GitHub OAuth app ID | Optional |
| `GITHUB_CLIENT_SECRET` | GitHub OAuth app secret | Optional |
| `GOOGLE_CLIENT_ID` | Google OAuth client ID | Optional |
| `GOOGLE_CLIENT_SECRET` | Google OAuth client secret | Optional |

---

## 📁 Project Structure

```
src/
├── app/
│   ├── (auth)/          # Login & Register pages
│   ├── (dashboard)/     # Dashboard, Profile, Projects
│   ├── api/             # API routes
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/
│   └── ui/              # Reusable UI components
├── lib/
│   ├── auth.ts          # NextAuth configuration
│   ├── prisma.ts        # Database client
│   ├── utils.ts         # Utility functions
│   └── validations.ts   # Zod schemas
└── types/
    └── index.ts         # TypeScript definitions
```

---

## 🤝 Contributing

Contributions are welcome! Feel free to:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---

## 👨‍💻 Author

**Sneh Shah**

- GitHub: [@snehshah](https://github.com/Snehshahaai)

---

*Built with ❤️ for the engineering community*
