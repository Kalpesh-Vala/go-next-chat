// Format date to a readable string
export const formatDate = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
      day: 'numeric',
      month: 'short',
    }).format(date);
  };
  
  // Format timestamp for chat messages
  export const formatMessageTime = (dateString) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      hour12: true,
    }).format(date);
  };
  
  // Get user initials for avatar
  export const getUserInitials = (name) => {
    if (!name) return '?';
    
    const parts = name.split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  };
  
  // Generate random color based on user ID (for consistent colors)
  export const getUserColor = (userId) => {
    if (!userId) return '#888888';
    
    // Simple hash function to generate a consistent color for a user
    const hash = userId.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);
    
    // Generate HSL color with high saturation and medium lightness
    // Use hue from hash to generate different colors
    const hue = hash % 360;
    return `hsl(${hue}, 65%, 55%)`;
  };
  
  // Determine if it's a new day in the chat (for date separators)
  export const isNewDay = (prevDate, currDate) => {
    if (!prevDate) return true;
    
    const prev = new Date(prevDate);
    const curr = new Date(currDate);
    
    return prev.toDateString() !== curr.toDateString();
  };
  
  // Group messages by sender for better UI display
  export const groupMessagesBySender = (messages) => {
    if (!messages.length) return [];
    
    return messages.reduce((groups, message, index) => {
      const prevMessage = messages[index - 1];
      
      // Start a new group if:
      // 1. This is the first message
      // 2. Different sender from previous message
      // 3. More than 2 minutes passed since the last message
      const shouldStartNewGroup = 
        !prevMessage || 
        prevMessage.senderId !== message.senderId ||
        (new Date(message.timestamp) - new Date(prevMessage.timestamp)) > 2 * 60 * 1000;
      
      if (shouldStartNewGroup) {
        groups.push([message]);
      } else {
        groups[groups.length - 1].push(message);
      }
      
      return groups;
    }, []);
  };