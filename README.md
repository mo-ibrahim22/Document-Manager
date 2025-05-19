# Document Manager

A modern, feature-rich document management system built with React and TypeScript, inspired by Google Drive's interface.

![Document Manager Screenshot](https://placehold.co/1200x630/1a73e8/ffffff?text=Document+Manager)

## Features

- 📁 Intuitive folder and file management
- 🔍 Real-time search functionality
- 📊 Multiple view modes (Grid/List)
- 🔄 Sorting options (Name, Date, Size)
- ⭐ File starring system
- 🏷️ Tag management
- 👥 File sharing and permissions
- 📱 Responsive design
- 🎨 Modern, clean interface

## Tech Stack

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Lucide Icons

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```

## Project Structure

```
src/
├── components/         # UI components
│   ├── layout/        # Layout components
│   ├── modals/        # Modal dialogs
│   └── ui/            # Reusable UI components
├── contexts/          # React contexts
├── data/             # Mock data
├── lib/              # Utility functions
├── pages/            # Page components
├── types/            # TypeScript types
└── utils/            # Helper utilities
```

## Features in Detail

### File Management
- Upload files
- Create folders
- Move files and folders
- Delete files and folders
- Star important files
- Add descriptions and tags

### Organization
- Sort files by name, date, or size
- Switch between grid and list views
- Search across all files and folders
- Tag-based organization

### Sharing & Permissions
- Share files with other users
- Set permission levels (View, Edit, Owner)
- Manage access control
- View shared files

### User Interface
- Clean, modern design
- Responsive layout
- Intuitive navigation
- Context menus
- File previews
- Progress indicators

## Development

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

### File Upload Support

Supported file types:
- PDF (.pdf)
- Microsoft Word (.doc, .docx)
- Microsoft Excel (.xls, .xlsx)
- Microsoft PowerPoint (.ppt, .pptx)
- Text files (.txt)
- CSV files (.csv)
- Images (.jpg, .png, .gif)

### Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a pull request

## License

MIT License - feel free to use this project for personal or commercial purposes.