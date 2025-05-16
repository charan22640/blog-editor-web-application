# 📝 Blog Editor - Full Stack Application

![Blog Editor Banner](https://user-images.githubusercontent.com/YOUR_GITHUB_USERNAME/blog-editor-web-application/main/public/blog-editor-banner.png)

## 📌 Overview

This is a full-stack blog editor application that allows users to write, edit, save, and publish blogs with an auto-save draft feature. The application features a modern UI with dark mode support, responsive design, and a rich text editor.

## ✨ Key Features

### Frontend
- **Modern UI**: Clean, responsive design with dark mode support
- **Blog Editor**:
  - Title field with validation
  - Rich text editor (React Quill) with formatting options
  - Tags field (comma-separated)
  - Form validation using Zod schema
- **Blog Management**:
  - Save as Draft functionality
  - Publish functionality
  - Filter blogs by status (All/Published/Draft)
  - Sort blogs by date or title
- **Auto-Save**:
  - Automatic saving after 3 seconds of inactivity using debouncing
  - Visual indicators for save status
  - Toggle to enable/disable auto-save
- **Responsive Design**:
  - Works on mobile, tablet, and desktop devices
  - Adaptive layout for different screen sizes

### Backend
- **API Endpoints**:
  - Create/update drafts
  - Publish blogs
  - Retrieve all blogs
  - Retrieve blog by ID
  - Authentication endpoints (login/signup/logout)
- **Data Validation**:
  - Input validation on all endpoints
  - Proper error handling and feedback
- **Database**:
  - MongoDB integration via Mongoose
  - Efficient schema design

### Authentication & Security
- JWT-based authentication system
- Protected routes and API endpoints
- Secure password handling with bcrypt

## 🔧 Technologies Used

### Frontend
- Next.js 14 (React framework)
- TypeScript
- Tailwind CSS for styling
- React Hook Form for form management
- Zod for schema validation
- React Quill for rich text editing
- Lucide React for icons
- Sonner for toast notifications

### Backend
- Next.js API Routes (serverless functions)
- MongoDB with Mongoose ODM
- JWT for authentication
- bcrypt for password hashing

## 🏗️ System Architecture

```
[ User (Browser) ]
      |
      V
[ Frontend (Next.js / React) ]
      |
      | REST API Calls (HTTP)
      |
      V
[ Backend (Next.js API Routes) ]
      |
      V
[ Database (MongoDB) ]
```

## 🌐 API Endpoints

| Method | Endpoint             | Description                    |
|--------|----------------------|--------------------------------|
| POST   | /api/blogs           | Create a new blog or draft     |
| GET    | /api/blogs           | Retrieve all blogs             |
| GET    | /api/blogs/:id       | Retrieve a blog by ID          |
| PUT    | /api/blogs/:id       | Update a blog                  |
| DELETE | /api/blogs/:id       | Delete a blog                  |
| POST   | /api/auth/signup     | Register a new user            |
| POST   | /api/auth/login      | Login a user                   |
| POST   | /api/auth/logout     | Logout a user                  |

## 📋 Blog Schema

```typescript
{
  _id: string,
  title: string,
  content: string,
  tags: string,
  status: 'draft' | 'published',
  createdAt: Date,
  updatedAt: Date,
  author: Types.ObjectId
}
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- MongoDB instance (local or cloud)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_GITHUB_USERNAME/blog-editor-web-application.git
   cd blog-editor-web-application
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory with the following variables:
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_secret_key
   ```

4. Run the development server:
   ```bash
   npm run dev
   ```

5. Open [http://localhost:3000](http://localhost:3000) with your browser to see the application.

## 📱 Demo

- **Home Screen**:
  ![Home Screen](https://user-images.githubusercontent.com/YOUR_GITHUB_USERNAME/blog-editor-web-application/main/public/screenshots/home.png)

- **Blog Editor**:
  ![Blog Editor](https://user-images.githubusercontent.com/YOUR_GITHUB_USERNAME/blog-editor-web-application/main/public/screenshots/editor.png)

- **Blog List**:
  ![Blog List](https://user-images.githubusercontent.com/YOUR_GITHUB_USERNAME/blog-editor-web-application/main/public/screenshots/list.png)

## 🧪 Implementation Details

### Auto-Save Feature
The auto-save functionality uses debouncing to prevent excessive API calls. When a user stops typing for 3 seconds, the application automatically saves their progress as a draft. Visual indicators show the saving status and last saved time.

```typescript
// Debounced auto-save implementation
useEffect(() => {
  if (!autoSaveEnabled || !isDirty) return;
  
  changesSinceLastSave.current = true;
  
  const timer = setTimeout(() => {
    if (changesSinceLastSave.current && isValid && watchedValues.title && watchedValues.content) {
      handleAutoSave();
    }
  }, 3000);

  return () => clearTimeout(timer);
}, [watchedValues, isDirty, isValid]);
```

### Form Validation
All forms in the application use Zod schema validation to ensure data integrity:

```typescript
const blogSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  content: z.string().min(10, 'Content must be at least 10 characters'),
  tags: z.string().optional(),
  status: z.enum(['draft', 'published']).default('draft')
});
```

### Authentication Flow
The application uses JWT tokens for authentication. When a user logs in, a JWT token is generated and stored in an HTTP-only cookie. This token is then validated on protected routes and API endpoints.

## 📈 Future Improvements

- Add search functionality for blogs
- Implement comment system
- Add image upload capabilities
- Implement collaborative editing
- Add analytics dashboard

## 👨‍💻 Author

-Sai Charan -https://github.com/charan22640/blog-editor-web-application 

## 📄 License

This project is licensed under the MIT License - see the (LICENSE) file for details.

