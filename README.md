# LMS Frontend

A modern Learning Management System frontend built with Next.js 14, TypeScript, and Tailwind CSS.

## 🚀 Features

- **Modern UI/UX**: Built with Next.js 14 and Tailwind CSS
- **Type Safety**: Full TypeScript support
- **State Management**: Redux Toolkit for global state
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Custom components with shadcn/ui pattern
- **Authentication**: JWT-based auth with refresh tokens
- **Responsive Design**: Mobile-first approach
- **Code Quality**: ESLint and Prettier for code formatting

## 📋 Prerequisites

- Node.js (v18 or higher)
- npm or yarn

## 🛠️ Installation

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Environment Setup**

   ```bash
   cp .env.example .env.local
   ```

   Update the `.env.local` file:

   ```env
   API_URL=http://localhost:5001/api/v1
   ```

3. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (withCommonLayout)/ # Route group for common layout
│   ├── (withDashboardLayout)/ # Route group for dashboard layout
│   ├── login/             # Login page
│   ├── register/          # Register page
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── not-found.tsx      # 404 page
├── components/            # Reusable components
│   └── ui/               # UI components (shadcn/ui)
├── constants/            # Application constants
├── helpers/             # Helper functions
│   └── axios/           # Axios configuration
├── hooks/               # Custom React hooks
├── lib/                 # Utility libraries
├── redux/               # Redux store and slices
├── types/               # TypeScript type definitions
└── utils/               # Utility functions
```

## 🧪 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint errors
- `npm run format` - Format code with Prettier
- `npm run type-check` - TypeScript type checking

## 🎨 UI Components

The project uses a component library built with:

- **Radix UI**: Accessible UI primitives
- **Tailwind CSS**: Utility-first CSS framework
- **class-variance-authority**: Component variant management
- **clsx & tailwind-merge**: Class name utilities

### Available Components

- `Button` - Versatile button component with variants
- More components to be added...

## 🔧 Development

### Code Quality

- ESLint for code linting
- Prettier for code formatting
- TypeScript for type safety

### State Management

- Redux Toolkit for global state
- Async thunks for API calls
- Persisted authentication state

### API Integration

- Axios for HTTP requests
- Automatic token refresh
- Request/response interceptors

### Styling

- Tailwind CSS for styling
- CSS modules for component-specific styles
- Responsive design utilities

## 🚀 Deployment

### Environment Variables

Set the following environment variables:

- `API_URL`: Backend API URL

### Build Process

1. Run `npm run build`
2. Deploy the `out` directory to your hosting platform

### Recommended Platforms

- Vercel (recommended for Next.js)
- Netlify
- AWS Amplify

## 📝 License

This project is licensed under the MIT License.
