# 🌟 Moody Track Sparkle - Contributor Guide

A beautiful, intuitive mood and productivity tracking web application built with React, TypeScript, and Supabase. This guide will help you get started as a contributor to the project.

## 🎯 Project Overview

Moody Track Sparkle helps users monitor their emotional well-being, productivity levels, and energy patterns through daily logging, insightful analytics, and personalized recommendations. The app features emoji-based mood tracking, productivity sliders, streak monitoring, and real-time analytics.

## ✨ Features

- **🎭 Emoji Mood Tracking** - Log daily moods using intuitive emoji selection
- **📊 Productivity & Energy Sliders** - Rate your daily productivity and energy levels (1-10 scale)
- **📝 Daily Notes** - Add optional reflection notes to capture context
- **📈 Interactive Analytics** - Visualize mood patterns with charts and graphs
- **🎯 Streak Tracking** - Monitor consistent logging habits
- **🏆 Achievement System** - Unlock badges for milestones and consistent usage
- **💡 Personalized Insights** - AI-powered recommendations based on your patterns
- **👥 Admin Dashboard** - Real-time user management and system analytics
- **🌙 Dark/Light Mode** - Comfortable viewing in any lighting condition
- **📱 Responsive Design** - Seamless experience across all devices
- **🔐 Secure Authentication** - Email/password login with session management

## 🛠 Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **Styling**: Tailwind CSS with custom design system
- **UI Components**: shadcn/ui component library
- **Charts**: Recharts for data visualization
- **Authentication**: Supabase Auth
- **Database**: Supabase PostgreSQL
- **State Management**: TanStack Query (React Query)
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Notifications**: Sonner Toast

## 🚀 Quick Start for Contributors

### Prerequisites

- **Node.js 18+** and npm installed
- **Git** configured with your GitHub account
- **Supabase account** (team lead will provide project access)
- **Code editor** (VS Code recommended with TypeScript extension)

### 1. Clone & Setup

```bash
# Clone the repository
https://github.com/Thirty-manu/-MoodLens.git
cd moodlens

# Install dependencies
npm install

# Start development server
npm run dev
```



### 3. Verify Setup

Visit `http://localhost:5173` - you should see the login page. If everything works, you're ready to contribute!

## 🏗️ Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── auth/            # Authentication forms
│   ├── layout/          # Navigation, layout components  
│   ├── mood/            # Mood tracking components
│   └── ui/              # shadcn/ui components
├── pages/               # Route pages (Dashboard, Analytics, etc.)
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── index.css           # Global styles & design system
```

### 4. Database Schema (Reference Only)

The Supabase database includes:

```sql
-- Create mood_logs table
CREATE TABLE mood_logs (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  mood VARCHAR(50) NOT NULL,
  mood_value INTEGER NOT NULL CHECK (mood_value >= 1 AND mood_value <= 5),
  productivity INTEGER NOT NULL CHECK (productivity >= 1 AND productivity <= 10),
  energy INTEGER NOT NULL CHECK (energy >= 1 AND energy <= 10),
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create users profile table
CREATE TABLE user_profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name VARCHAR(255),
  avatar_url TEXT,
  timezone VARCHAR(50) DEFAULT 'UTC',
  streak_count INTEGER DEFAULT 0,
  total_logs INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create achievements table
CREATE TABLE achievements (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  achievement_type VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  earned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE mood_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own mood logs" ON mood_logs
  FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Users can view own profile" ON user_profiles
  FOR ALL USING (auth.uid() = id);

CREATE POLICY "Users can view own achievements" ON achievements
  FOR ALL USING (auth.uid() = user_id);
```

## 📊 Database Tables

### mood_logs
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key to auth.users)
- `mood` (VARCHAR) - Emoji representation
- `mood_value` (INTEGER 1-5) - Numeric mood rating
- `productivity` (INTEGER 1-10) - Daily productivity rating
- `energy` (INTEGER 1-10) - Daily energy level
- `notes` (TEXT) - Optional reflection notes
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### user_profiles
- `id` (UUID, Primary Key, Foreign Key to auth.users)
- `display_name` (VARCHAR)
- `avatar_url` (TEXT)
- `timezone` (VARCHAR)
- `streak_count` (INTEGER)
- `total_logs` (INTEGER)
- `created_at` (TIMESTAMP)
- `updated_at` (TIMESTAMP)

### achievements
- `id` (UUID, Primary Key)
- `user_id` (UUID, Foreign Key)
- `achievement_type` (VARCHAR)
- `title` (VARCHAR)
- `description` (TEXT)
- `earned_at` (TIMESTAMP)

## 🎨 Design System & Development Guidelines

### Design Principles
- **Wellness-focused**: Calming colors, gentle animations
- **Semantic tokens**: Use CSS variables from `index.css`, not direct colors
- **Mobile-first**: Responsive design approach
- **Accessibility**: Proper contrast ratios and keyboard navigation

### Code Style
- **TypeScript**: Strict typing, interfaces for all data structures
- **Components**: Small, focused, reusable components
- **Naming**: Descriptive names, consistent conventions
- **Imports**: Use absolute imports with `@/` prefix

### Key Files to Understand
- `src/index.css` - Design system tokens and global styles
- `tailwind.config.ts` - Tailwind configuration with custom colors
- `src/components/ui/` - Base UI components (shadcn/ui)

## 🔧 Common Development Tasks

### Adding a New Page
1. Create component in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Add navigation link in `src/components/layout/Navigation.tsx`

### Adding a New Feature
1. Create feature components in appropriate folder
2. Add any new types/interfaces
3. Update database schema if needed (coordinate with team)
4. Add proper error handling and loading states
5. Test on mobile and desktop

### Working with Supabase
- Use existing patterns from other components
- Handle loading and error states
- Implement proper TypeScript types for data
- Test with real data, not just mock data

### Styling Guidelines
```tsx
// ❌ Don't use direct colors
<div className="bg-blue-500 text-white">

// ✅ Use semantic tokens
<div className="bg-primary text-primary-foreground">
```

## 🗺️ Roadmap & Available Tasks

### 🚀 High Priority
- [ ] **Real-time Features** - Live admin dashboard updates
- [ ] **Data Export** - CSV/PDF export functionality
- [ ] **Notification System** - Gentle daily reminders
- [ ] **Mobile PWA** - Offline support and app installation

### 🎯 Medium Priority  
- [ ] **Advanced Analytics** - Mood prediction algorithms
- [ ] **Goal Setting** - Personal wellness targets
- [ ] **Custom Moods** - User-defined mood categories
- [ ] **Social Features** - Share achievements safely

### 🔮 Future Ideas
- [ ] **Integrations** - Calendar, fitness trackers
- [ ] **Therapist Dashboard** - Professional interface
- [ ] **Habit Correlation** - Activity-mood relationships
- [ ] **AI Insights** - Personalized recommendations

> **Want to work on something?** Check the [Issues](../../issues) tab for detailed tasks and discussions.

## 🤝 Contributing Workflow

### Before Starting
1. **Check existing issues** - Look for open issues or create one for discussion
2. **Claim the task** - Comment on the issue to avoid duplicate work
3. **Understand the scope** - Ask questions if requirements are unclear

### Development Process
```bash
# 1. Create a feature branch from main
git checkout main
git pull origin main
git checkout -b feature/your-feature-name

# 2. Make your changes
# Write code, add tests, update documentation

# 3. Test your changes
npm run dev        # Test locally
npm run build      # Ensure it builds
npm run type-check # TypeScript validation

# 4. Commit with clear messages
git add .
git commit -m "feat: add mood export functionality"

# 5. Push and create PR
git push origin feature/your-feature-name
```

### Pull Request Guidelines
- **Clear title**: Describe what the PR does
- **Description**: Explain the changes and reasoning
- **Screenshots**: Include before/after for UI changes
- **Testing**: Describe how you tested the changes
- **Link issues**: Reference related issue numbers

### Commit Message Format
```
type(scope): description

feat: add new feature
fix: bug fix
docs: documentation changes
style: formatting, no code change
refactor: code refactoring
test: adding tests
chore: maintenance tasks
```

## 🐛 Troubleshooting

### Common Issues
- **Environment variables not loading**: Ensure `.env.local` exists and is properly formatted
- **Supabase connection errors**: Verify URLs and keys with project maintainer
- **TypeScript errors**: Check imports and interface definitions
- **Build failures**: Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`

### Getting Help
1. Check existing [Issues](../../issues) for similar problems
2. Ask in project discussions or team chat
3. Include error messages and steps to reproduce
4. Share relevant code snippets (without sensitive data)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📚 Resources & Learning

### Key Technologies
- [React](https://react.dev/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [shadcn/ui](https://ui.shadcn.com/) - Component library
- [Supabase](https://supabase.com/docs) - Backend platform
- [Vite](https://vitejs.dev/) - Build tool

### Helpful Links
- [Project Issues](../../issues) - Current tasks and bugs
- [Supabase Dashboard](https://supabase.com/dashboard) - Database management
- [Deployment](../../deployments) - Live application versions

---

**Ready to contribute?** Pick an issue, follow the workflow, and help make mood tracking more accessible! 🌟
