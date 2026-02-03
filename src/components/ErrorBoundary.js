import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../theme/colors';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo);

    this.setState({
      error: error,
      errorInfo: errorInfo
    });

    // Log error to service (optional)
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  handleRetry() {
    this.setState({ hasError: false, error: null, errorInfo: null });
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <View style={styles.container}>
          <View style={styles.content}>
          <Text style={styles.title}>
            Oops! Something went wrong
          </Text>
          <Text style={styles.message}>
            {this.props.errorMessage ||
              'An unexpected error occurred. The app has been stabilized.'}
          </Text>

            {__DEV__ && this.state.error && (
              <View style={styles.errorDetails}>
                <Text style={styles.errorText}>
                  Error: {this.state.error.toString()}
                </Text>
              </View>
            )}

            <View style={styles.actions}>
              {this.props.retryButton && (
                <View style={styles.button}>
                  <Text onPress={this.handleRetry} style={styles.retryText}>
                    Try Again
                  </Text>
                </View>
              )}
              {this.props.showHomeButton && (
                <TouchableOpacity
                  onPress={() => this.props.navigation?.navigate('Home')}
                  style={styles.button}
                >
                  <Text style={styles.retryText}>
                    Go Home
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  content: {
    alignItems: 'center',
    maxWidth: 300,
  },
  title: {
    color: COLORS.primary,
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 20,
    fontWeight: 'bold',
  },
  message: {
    color: COLORS.grey.dark,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
    fontSize: 16,
  },
  errorDetails: {
    backgroundColor: COLORS.grey.light,
    padding: 12,
    borderRadius: 8,
    marginVertical: 16,
    width: '100%',
  },
  errorText: {
    color: COLORS.black,
    fontSize: 12,
    fontFamily: 'monospace',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    width: '100%',
  },
  button: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  retryText: {
    color: COLORS.white,
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ErrorBoundary;