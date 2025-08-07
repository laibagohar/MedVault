# MedVault Frontend

A modern, clean, and user-friendly frontend for the MedVault medical report management system.

## 🚀 Features

### **Dashboard**
- **Report Management**: View, upload, and manage all medical reports
- **Real-time Statistics**: See total reports, completed, and processing counts
- **Filter by Type**: Filter reports by CBC, Liver Function, Diabetes, Thyroid, or Other
- **Report Actions**: View details, reprocess, and delete reports
- **File Upload**: Upload PDF and image files with patient information
- **Status Tracking**: Visual status indicators (completed, processing, error)

### **Authentication**
- **Secure Login**: JWT-based authentication
- **Token Management**: Automatic token storage and usage
- **User Session**: Persistent user sessions

### **Reference Values**
- **Browse Reference Values**: View medical test reference ranges
- **Search & Filter**: Search by test name/category, filter by gender
- **Expandable Details**: Click to see detailed reference information
- **Responsive Design**: Works on all devices

## 🛠️ Technology Stack

- **React 19.1.1** - Modern React with hooks
- **Axios** - HTTP client for API calls
- **React Router DOM** - Client-side routing
- **CSS3** - Custom styling with modern design
- **Responsive Design** - Mobile-first approach

## 📁 Project Structure

```
src/
├── components/
│   ├── Dashboard.jsx          # Main dashboard component
│   ├── Dashboard.css          # Dashboard styling
│   ├── login.jsx             # Login component
│   ├── login.css             # Login styling
│   ├── navbar.jsx            # Navigation component
│   ├── ReferenceValues.jsx   # Reference values viewer
│   ├── ReferenceValues.css   # Reference values styling
│   └── ...                   # Other components
├── App.js                    # Main app component with routing
└── index.js                  # App entry point
```

## 🔧 Setup & Installation

1. **Install Dependencies**
   ```bash
   cd medvault-frontend
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Build for Production**
   ```bash
   npm run build
   ```

## 🎯 API Integration

### **Authentication Endpoints**
- `POST /api/users/login` - User login
- `POST /api/users/register` - User registration

### **Report Endpoints**
- `GET /api/reports` - Get all user reports
- `POST /api/reports` - Upload new report with file
- `GET /api/reports/:id` - Get specific report
- `PUT /api/reports/:id` - Update report
- `DELETE /api/reports/:id` - Delete report
- `POST /api/reports/:id/reprocess` - Reprocess report
- `GET /api/reports/:id/recommendations` - Get recommendations

### **Reference Values Endpoints**
- `GET /api/reference-values` - Get all reference values
- `GET /api/reference-values/category/:category` - Get by category
- `GET /api/reference-values/test/:testName` - Get by test name

## 🎨 UI/UX Features

### **Modern Design**
- Clean, professional medical interface
- Gradient backgrounds and smooth animations
- Consistent color scheme
- Responsive grid layouts

### **User Experience**
- Loading states and error handling
- Form validation and feedback
- Confirmation dialogs for destructive actions
- Expandable/collapsible content sections

### **Accessibility**
- Semantic HTML structure
- Keyboard navigation support
- Screen reader friendly
- High contrast color schemes

## 📱 Responsive Design

The frontend is fully responsive and works on:
- **Desktop** (1200px+)
- **Tablet** (768px - 1199px)
- **Mobile** (320px - 767px)

## 🔐 Security Features

- **JWT Token Management**: Secure token storage in localStorage
- **Protected Routes**: Authentication required for sensitive operations
- **Input Validation**: Client-side form validation
- **Error Handling**: Comprehensive error messages and recovery

## 🚀 Key Components

### **Dashboard Component**
```jsx
// Features:
- Report listing with filters
- File upload with patient data
- Real-time status updates
- CRUD operations for reports
- Statistics display
```

### **Login Component**
```jsx
// Features:
- Email/password authentication
- JWT token storage
- Error handling and validation
- Loading states
```

### **Reference Values Component**
```jsx
// Features:
- Search and filter functionality
- Expandable report details
- Category and gender filtering
- Responsive design
```

## 🎯 Usage Examples

### **Uploading a Report**
1. Navigate to Dashboard
2. Click "Upload New Report"
3. Fill in patient information
4. Select PDF/image file
5. Submit form

### **Viewing Reports**
1. Dashboard shows all reports
2. Use filters to narrow results
3. Click "View" to see details
4. Use "Reprocess" to re-analyze

### **Checking Reference Values**
1. Navigate to Reference Values
2. Use search to find specific tests
3. Filter by category or gender
4. Click to expand details

## 🔧 Configuration

### **API Base URL**
Update the API base URL in components:
```javascript
const API_BASE = 'http://localhost:5000/api';
```

### **Environment Variables**
Create `.env` file for environment-specific settings:
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_ENV=development
```

## 🐛 Troubleshooting

### **Common Issues**

1. **CORS Errors**
   - Ensure backend CORS is configured
   - Check API URL is correct

2. **Authentication Issues**
   - Clear localStorage and re-login
   - Check token expiration

3. **File Upload Errors**
   - Verify file size limits
   - Check supported file types

### **Development Tips**

- Use browser dev tools for debugging
- Check network tab for API calls
- Monitor localStorage for token management
- Test responsive design on different screen sizes

## 🚀 Future Enhancements

- **Real-time Updates**: WebSocket integration
- **Offline Support**: Service worker implementation
- **Advanced Filtering**: Date ranges, status filters
- **Export Features**: PDF generation, data export
- **Dark Mode**: Theme switching capability
- **Multi-language**: Internationalization support

## 📄 License

This project is part of the MedVault medical report management system. 