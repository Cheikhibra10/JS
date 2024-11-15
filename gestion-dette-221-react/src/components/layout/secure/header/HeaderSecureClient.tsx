import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../../../services/AuthService";
import { useAuth } from "../../../../utils/AuthProvider";
import apiClient from "../../../../services/api-client";

// Define the Notification interface
interface Notification {
  id: number;
  message: string;
  createdAt: string; // Or 'Date' if you prefer
  read: boolean;
}

// Define the props for NotificationModal
interface NotificationModalProps {
  notification: Notification | null; // Use the existing Notification interface
  onClose: () => void; // Define onClose as a function with no arguments
}

const NotificationModal: React.FC<NotificationModalProps> = ({ notification, onClose }) => {
  // Check if the notification is null and don't render the modal
  if (!notification) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-4 max-w-md w-full">
        <h2 className="text-lg font-semibold">{notification.message}</h2>
        <p className="text-gray-500">{notification.createdAt}</p>
        <button
          onClick={() => {
            console.log('Close button clicked'); // Log for debugging
            onClose(); // Call onClose when button is clicked
          }}
          className="mt-4 bg-blue-500 text-white rounded px-4 py-2"
        >
          Fermer
        </button>
      </div>
    </div>
  );
};

export default function HeaderSecureClient() {
  const navigate = useNavigate();
  const authProvider = useAuth();
  const [isPopoverVisible, setPopoverVisible] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showMessages, setShowMessages] = useState(false);
  const notificationPopoverRef = useRef<HTMLDivElement>(null);
  const userProfilePopoverRef = useRef<HTMLDivElement>(null);
  const userId = authProvider.user?.client?.id; // Get user ID
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);

  // Fetch notifications for the user
  const fetchNotifications = async () => {
    const token = authService.getToken();
    if (!userId) {
      console.error("User ID is not defined.");
      return;
    }

    try {
      const response = await apiClient.get(`/notifications/${userId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setNotifications(response.data.data || []); // Set notifications
      console.log("Fetched Notifications:", response.data.data); // Log fetched notifications

      // Show modal if there are unread notifications
      const unreadNotifications = response.data.data.filter((notification: Notification) => !notification.read);
      if (unreadNotifications.length > 0) {
        setSelectedNotification(unreadNotifications[0]); // Select the first unread notification
        setModalVisible(false); // Show the modal
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  };

// Mark a notification as read and update the state
const markNotificationAsRead = async (notificationId: number) => {
  const token = authService.getToken();

  try {
    await apiClient.patch(
      `/notifications/${notificationId}/read`,
      { read: true },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Update the notifications state to mark the notification as read
    setNotifications((prevNotifications) =>
      prevNotifications.map((notification) =>
        notification.id === notificationId
          ? { ...notification, read: true } // Mark as read
          : notification
      )
    );
  } catch (error) {
    console.error("Error marking notification as read:", error);
  }
};

  // Toggle notifications and start the timer to mark as read
  const toggleNotification = () => {
    setShowMessages(prev => !prev);
    if (!showMessages) {
      fetchNotifications(); // Always fetch when opening
    }
  };

  const handleClick = () => {
    authService.logout();
    navigate('/');
  };

  const togglePopover = () => {
    setPopoverVisible(!isPopoverVisible);
  };

  useEffect(() => {
    fetchNotifications(); // Fetch notifications when component mounts
  }, [userId]); // Fetch notifications when userId changes

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        notificationPopoverRef.current &&
        !notificationPopoverRef.current.contains(event.target as Node) &&
        !isModalVisible // Prevent closing if modal is visible
      ) {
        setShowMessages(false);
        setSelectedNotification(null); // Reset on close
      }
      if (
        userProfilePopoverRef.current &&
        !userProfilePopoverRef.current.contains(event.target as Node)
      ) {
        setPopoverVisible(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
    };
  }, [isModalVisible]);

  const handleCloseModal = () => {
    if (selectedNotification) {
      markNotificationAsRead(selectedNotification.id); // Mark as read when modal is closed
    }
    console.log('Closing modal with notification ID:', selectedNotification?.id); // Log for debugging
    setSelectedNotification(null); // Clear selected notification
    setModalVisible(false); // Hide the modal
  };

  const fullname = authProvider.user?.client
    ? `${authProvider.user.client.prenom} ${authProvider.user.client.nom}`
    : 'User without Client';

  return (
    <header className="sticky top-0 z-10 flex flex-col sm:flex-row justify-between items-center bg-white shadow-md px-4 py-2 header">
         <button id="sidebarToggle" className="sm:hidden text-gray-500 mb-2 sm:mb-0">
          <svg className="w-8 h-8" stroke="currentColor" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
          </svg>
        </button>  

        {/* Search Bar */}
        <div className="search-bar flex items-center w-full sm:w-1/2 lg:w-3/5 mb-2 sm:mb-0">
          <input 
            type="text" 
            placeholder="Rechercher dans votre boutique..."
            className="w-full px-4 py-2 rounded-full border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm sm:text-base" 
          />
        </div>
      {/* Notification Icon */}
      <button
        className="relative text-gray-500 flex items-center"
        type="button"
        onClick={toggleNotification}
      >
        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 50 50">
            <path d="M 25 0 C 22.800781 0 21 1.800781 21 4 C 21 4.515625 21.101563 5.015625 21.28125 5.46875 C 15.65625 6.929688 12 11.816406 12 18 C 12 25.832031 10.078125 29.398438 8.25 31.40625 C 7.335938 32.410156 6.433594 33.019531 5.65625 33.59375 C 5.265625 33.878906 4.910156 34.164063 4.59375 34.53125 C 4.277344 34.898438 4 35.421875 4 36 C 4 37.375 4.84375 38.542969 6.03125 39.3125 C 7.21875 40.082031 8.777344 40.578125 10.65625 40.96875 C 13.09375 41.472656 16.101563 41.738281 19.40625 41.875 C 19.15625 42.539063 19 43.253906 19 44 C 19 47.300781 21.699219 50 25 50 C 28.300781 50 31 47.300781 31 44 C 31 43.25 30.847656 42.535156 30.59375 41.875 C 33.898438 41.738281 36.90625 41.472656 39.34375 40.96875 C 41.222656 40.578125 42.78125 40.082031 43.96875 39.3125 C 45.15625 38.542969 46 37.375 46 36 C 46 35.421875 45.722656 34.898438 45.40625 34.53125 C 45.089844 34.164063 44.734375 33.878906 44.34375 33.59375 C 43.566406 33.019531 42.664063 32.410156 41.75 31.40625 C 39.921875 29.398438 38 25.832031 38 18 C 38 11.820313 34.335938 6.9375 28.71875 5.46875 C 28.898438 5.015625 29 4.515625 29 4 C 29 1.800781 27.199219 0 25 0 Z M 25 2 C 26.117188 2 27 2.882813 27 4 C 27 5.117188 26.117188 6 25 6 C 23.882813 6 23 5.117188 23 4 C 23 2.882813 23.882813 2 25 2 Z M 27.34375 7.1875 C 32.675781 8.136719 36 12.257813 36 18 C 36 26.167969 38.078125 30.363281 40.25 32.75 C 41.335938 33.941406 42.433594 34.6875 43.15625 35.21875 C 43.515625 35.484375 43.785156 35.707031 43.90625 35.84375 C 44.027344 35.980469 44 35.96875 44 36 C 44 36.625 43.710938 37.082031 42.875 37.625 C 42.039063 38.167969 40.679688 38.671875 38.9375 39.03125 C 35.453125 39.753906 30.492188 40 25 40 C 19.507813 40 14.546875 39.753906 11.0625 39.03125 C 9.320313 38.671875 7.960938 38.167969 7.125 37.625 C 6.289063 37.082031 6 36.625 6 36 C 6 35.96875 5.972656 35.980469 6.09375 35.84375 C 6.214844 35.707031 6.484375 35.484375 6.84375 35.21875 C 7.566406 34.6875 8.664063 33.941406 9.75 32.75 C 11.921875 30.363281 14 26.167969 14 18 C 14 12.257813 17.324219 8.136719 22.65625 7.1875 Z" fill="#000000"></path>
          </svg>
          {notifications.filter(notification => !notification.read).length > 0 && (
          <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full px-1">
            {notifications.filter(notification => !notification.read).length}
          </span>
          )}
      </button>

      {/* Notifications Popover */}
          {showMessages && (
      <div className="absolute right-0 mt-2 w-96 bg-white noti bg-white rounded-lg shadow border border-gray-300 max-h-60 overflow-y-auto rounded shadow-lg z-10" ref={notificationPopoverRef}>
        {notifications.length === 0 ? (
          <div className="px-4 py-2 text-gray-500">No notifications</div>
        ) : (
          <>
            <h3 className="px-4 py-2 font-semibold">Notifications</h3>
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`px-4 py-2 hover:bg-gray-100 cursor-pointer ${notification.read ? 'opacity-50' : ''}`}
                onClick={() => {
                  setSelectedNotification(notification);
                  markNotificationAsRead(notification.id); // Mark as read when clicked
                  setModalVisible(true);
                  console.log('Notification Clicked:', notification); // Log the clicked notification
                }}
              >
                {notification.message}
                <span className="block text-gray-500 text-sm">{new Date(notification.createdAt).toLocaleString()}</span>
              </div>
            ))}
          </>
        )}
      </div>
    )}
      {/* User Profile Button */}
       <button 
        className="header-user flex items-center mt-2 sm:mt-0" 
        onClick={togglePopover} 
        type="button"
      >
        <img 
          src={authProvider.user?.client?.photo || "https://via.placeholder.com/150"} 
          alt="Photo Utilisateur"
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 border-blue-500" 
        />
         <span className="absolute profile right-0 bottom-0 h-2 w-2 rounded-full bg-green-400 ring ring-white"></span>
        <div className="pl-2 sm:pl-4 py-1 ml-2">
          <p className="text-gray-700 text-xs sm:text-sm font-semibold">
            {authProvider.user?.client?.prenom}
          </p>
          <p className="text-gray-700 text-xs sm:text-sm font-semibold">
            {authProvider.user?.role}
          </p>
        </div>
      </button>

      {/* User Profile Popover */}
      {isPopoverVisible && (
      <div 
        ref={userProfilePopoverRef}
        className={`absolute right-2 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 $`}
        style={{ top: 3 }}
      >
        <div className="px-4 py-2 text-center">
          <img 
            className="w-16 h-16 rounded-full mx-auto"
            src={authProvider.user?.client?.photo || "https://via.placeholder.com/150"}
            alt="User avatar" 
          />
          <p className="mt-2 font-semibold">{fullname}</p>
        </div>

        <button 
          type="button" 
          onClick={handleClick}
          className="block px-12 py-2 text-sm text-center text-gray-700 hover:bg-gray-100"
        >
          DECONNEXION
        </button>
      </div>
      )}

       {/* Notification Modal */}
       {isModalVisible && (
        <NotificationModal
          notification={selectedNotification}
          onClose={handleCloseModal} // Pass the handleCloseModal function
        />
      )}
      </header>
    );
}
