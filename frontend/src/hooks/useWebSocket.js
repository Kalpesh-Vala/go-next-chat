'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

const useWebSocket = (userId) => {
  const [messages, setMessages] = useState([]);
  const [users, setUsers] = useState([]);
  const [connected, setConnected] = useState(false);
  const [error, setError] = useState(null);
  const socketRef = useRef(null);

  // Initialize WebSocket connection
  useEffect(() => {
    if (!userId) return;
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('No authentication token available');
      return;
    }

    // Create WebSocket connection
    const ws = new WebSocket(`ws://localhost:8080/ws/${userId}`);
    socketRef.current = ws;

    // WebSocket event listeners
    ws.onopen = () => {
      console.log('WebSocket connected');
      setConnected(true);
      setError(null);
      
      // Fetch all users
      fetchUsers();
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log('Received message:', data);
      
      // Handle different message types
      if (data.type === 'message') {
        setMessages(prev => [...prev, data]);
      } else if (data.type === 'user_list') {
        setUsers(data.users);
      } else if (data.type === 'user_status') {
        updateUserStatus(data.userId, data.status);
      }
    };

    ws.onerror = (error) => {
      console.error('WebSocket error:', error);
      setError('WebSocket connection error');
      setConnected(false);
    };

    ws.onclose = () => {
      console.log('WebSocket disconnected');
      setConnected(false);
    };

    // Cleanup WebSocket on unmount
    return () => {
      if (ws.readyState === WebSocket.OPEN || 
          ws.readyState === WebSocket.CONNECTING) {
        ws.close();
      }
    };
  }, [userId]);

  // Fetch all users
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      const data = await response.json();
      setUsers(data);
    } catch (err) {
      setError(err.message);
    }
  };

  // Update user status
  const updateUserStatus = (userId, status) => {
    setUsers(prevUsers => 
      prevUsers.map(user => 
        user.id === userId ? { ...user, status } : user
      )
    );
  };

  // Send a message
  const sendMessage = useCallback((content, recipientId = null) => {
    if (!socketRef.current || socketRef.current.readyState !== WebSocket.OPEN) {
      setError('WebSocket is not connected');
      return false;
    }

    try {
      const message = {
        type: 'message',
        content,
        senderId: userId,
        recipientId, // null for broadcast, specific ID for direct message
        timestamp: new Date().toISOString()
      };
      
      socketRef.current.send(JSON.stringify(message));
      return true;
    } catch (err) {
      setError('Failed to send message: ' + err.message);
      return false;
    }
  }, [userId, socketRef]);

  return {
    messages,
    users,
    connected,
    error,
    sendMessage
  };
};

export default useWebSocket;