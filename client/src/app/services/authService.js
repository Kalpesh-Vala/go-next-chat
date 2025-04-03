// src/app/services/authService.js
const API_URL = 'http://localhost:8080/api';

export async function register(userData) {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Registration failed');
    }
    
    return await response.json();
  } catch (error) {
    throw new Error(error.message || 'Registration failed');
  }
}

// export async function login(credentials) {
//   try {
//     const response = await fetch(`${API_URL}/login`, {
//       method: 'POST',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//       body: JSON.stringify(credentials),
//     });
    
//     if (!response.ok) {
//       const errorData = await response.json();
//       throw new Error(errorData.message || 'Login failed');
//     }
    
//     return await response.json();
//   } catch (error) {
//     throw new Error(error.message || 'Login failed');
//   }
// }

// src/app/services/authService.js - Make sure this function returns user ID
export async function login(credentials) {
    try {
      const response = await fetch(`${API_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Login failed');
      }
      
      const responseData = await response.json();
      // If responseData doesn't include user ID, you might need to make another API call to get user details
      return responseData;
    } catch (error) {
      throw new Error(error.message || 'Login failed');
    }
  }