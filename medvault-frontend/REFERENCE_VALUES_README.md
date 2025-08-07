# Reference Values Feature

This feature allows users to view and search through medical test reference ranges, and administrators to manage these reference values.

## Features

### For Users
- **View Reference Values**: Browse all available medical test reference ranges
- **Search Functionality**: Search by test name or category
- **Filter Options**: Filter by category and gender
- **Expandable Details**: Click on any reference value to see detailed information
- **Responsive Design**: Works on desktop and mobile devices

### For Administrators
- **Add New Reference Values**: Create new reference ranges with all required fields
- **Edit Existing Values**: Modify existing reference values
- **Delete Values**: Remove reference values from the system
- **Protected Routes**: Admin functions require authentication

## API Endpoints

### Public Endpoints (No Authentication Required)
- `GET /api/reference-values` - Get all reference values
- `GET /api/reference-values/:id` - Get specific reference value by ID
- `GET /api/reference-values/category/:category` - Get reference values by category
- `GET /api/reference-values/test/:testName` - Get reference values by test name

### Protected Endpoints (Authentication Required)
- `POST /api/reference-values` - Create new reference value
- `PUT /api/reference-values/:id` - Update existing reference value
- `DELETE /api/reference-values/:id` - Delete reference value

## Frontend Routes

- `/reference-values` - Public view for browsing reference values
- `/reference-values-admin` - Admin interface for managing reference values

## Data Structure

Each reference value contains:
- `testCategory` (string, required) - Category of the test (e.g., "Blood Test", "Urine Test")
- `testName` (string, required) - Name of the specific test
- `testUnit` (string, required) - Unit of measurement
- `minValue` (number, optional) - Minimum reference value
- `maxValue` (number, optional) - Maximum reference value
- `gender` (string, required) - Gender specification ("Male", "Female", "Both")
- `ageMin` (number, optional) - Minimum age for this reference range
- `ageMax` (number, optional) - Maximum age for this reference range

## Usage Examples

### Adding a Reference Value (Admin)
```javascript
const newReferenceValue = {
  testCategory: "Blood Test",
  testName: "Hemoglobin",
  testUnit: "g/dL",
  minValue: 12.0,
  maxValue: 16.0,
  gender: "Female",
  ageMin: 18,
  ageMax: 65
};
```

### Searching Reference Values (User)
1. Navigate to `/reference-values`
2. Use the search box to find specific tests
3. Use category and gender filters to narrow results
4. Click on any item to see detailed information

## Styling

The components use modern CSS with:
- Gradient backgrounds
- Hover effects
- Responsive design
- Clean typography
- Professional color scheme

## Authentication

Admin functions require a valid JWT token stored in localStorage as 'token'. The token should be included in the Authorization header for protected API calls.

## Error Handling

The components include comprehensive error handling:
- Network errors
- API errors
- Validation errors
- User-friendly error messages

## Future Enhancements

Potential improvements:
- Bulk import/export functionality
- Advanced search filters
- Reference value comparison tools
- Integration with patient test results
- Version history for reference values 