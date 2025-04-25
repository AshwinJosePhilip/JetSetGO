import { Component } from 'react';
import { Alert } from '@mui/material';

class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <Alert severity="error" sx={{ 
          maxWidth: '600px', 
          margin: '2rem auto',
          '& .MuiAlert-icon': { color: '#FF8000' },
          '& .MuiAlert-message': { color: '#FF8000' }
        }}>
          Something went wrong. Please try refreshing the page.
        </Alert>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;