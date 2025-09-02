"use client";

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Loader2, CheckCircle, XCircle, Database } from 'lucide-react';

interface TestResult {
  endpoint: string;
  status: 'loading' | 'success' | 'error';
  message: string;
  data?: any;
}

export default function DatabaseTestPage() {
  const [results, setResults] = useState<TestResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);

  const testEndpoints = [
    { name: 'Database Connection', endpoint: '/api/test-db' },
    { name: 'Users API', endpoint: '/api/users' },
    { name: 'Listings API', endpoint: '/api/listings' },
  ];

  const runTest = async (endpoint: string) => {
    try {
      const response = await fetch(endpoint);
      const data = await response.json();
      
      return {
        endpoint,
        status: response.ok ? 'success' : 'error',
        message: response.ok ? 'Working correctly' : data.error || 'Request failed',
        data: response.ok ? data : undefined,
      };
    } catch (error: any) {
      return {
        endpoint,
        status: 'error',
        message: error.message || 'Network error',
      };
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setResults([]);

    for (const test of testEndpoints) {
      setResults(prev => [...prev, { endpoint: test.name, status: 'loading', message: 'Testing...' }]);
      
      const result = await runTest(test.endpoint);
      
      setResults(prev => 
        prev.map(r => 
          r.endpoint === test.name ? result : r
        )
      );
      
      // Small delay between tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    setIsRunning(false);
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'loading':
        return <Loader2 className="h-4 w-4 animate-spin" />;
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'loading':
        return <Badge variant="secondary">Testing...</Badge>;
      case 'success':
        return <Badge variant="default" className="bg-green-500">Success</Badge>;
      case 'error':
        return <Badge variant="destructive">Error</Badge>;
      default:
        return null;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Database className="h-8 w-8" />
        <h1 className="text-3xl font-bold">Database Test</h1>
      </div>

      <Alert>
        <AlertDescription>
          This page tests your database connection and API endpoints. Make sure MongoDB is running before testing.
        </AlertDescription>
      </Alert>

      <Card>
        <CardHeader>
          <CardTitle>Database Tests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button 
            onClick={runAllTests} 
            disabled={isRunning}
            className="w-full"
          >
            {isRunning ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Running Tests...
              </>
            ) : (
              'Run All Tests'
            )}
          </Button>

          <div className="space-y-3">
            {results.map((result, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(result.status)}
                  <div>
                    <div className="font-medium">{result.endpoint}</div>
                    <div className="text-sm text-gray-600">{result.message}</div>
                  </div>
                </div>
                {getStatusBadge(result.status)}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Setup Instructions</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-medium">Option 1: Local MongoDB</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              <div># Install MongoDB</div>
              <div>brew install mongodb-community</div>
              <div># Start MongoDB</div>
              <div>brew services start mongodb-community</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Option 2: MongoDB Atlas (Cloud)</h3>
            <div className="bg-gray-100 p-3 rounded text-sm">
              <div>1. Go to <a href="https://www.mongodb.com/atlas" className="text-blue-600 underline">MongoDB Atlas</a></div>
              <div>2. Create a free account and cluster</div>
              <div>3. Get your connection string</div>
              <div>4. Add to .env.local: MONGODB_URI=your_connection_string</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="font-medium">Environment Setup</h3>
            <div className="bg-gray-100 p-3 rounded text-sm font-mono">
              <div># Create .env.local file</div>
              <div>MONGODB_URI=mongodb://localhost:27017/social-media-app</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

