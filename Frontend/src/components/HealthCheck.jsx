import React, { useEffect, useState } from 'react'
import backendUrl from '../BackendUrlConfig'
import { useAuth } from '../AuthContext'

function HealthCheck() {

    const { isDarkMode } = useAuth();
    const [isBackendUp, setIsBackendUp] = useState(null);

    const checkBackendHealth = async () => {
        try {
            const response = await backendUrl.get('/public/health-check');
            if(response.data == 'Ok'){
                setIsBackendUp(true)
            } else{
                setIsBackendUp(false)
            }
        } 
        catch (error) {
            setIsBackendUp(false);
        }
    }

    useEffect(() => {
        checkBackendHealth();
    }, []);

    return (
      <div
          className={`${
              isDarkMode ? 'bg-gray-900' : 'bg-gray-100'
          } flex justify-center items-center h-screen`}
      >
          <div
              className={`${
                  isDarkMode ? 'bg-gray-800 text-white' : 'bg-white text-gray-800'
              } p-6 rounded-lg shadow-md w-96 text-center`}
          >
              <h2
                  className={`${
                      isDarkMode ? 'text-white' : 'text-gray-800'
                  } text-2xl font-bold mb-4`}
              >
                  Backend Health Check
              </h2>
              {isBackendUp === null ? (
                  <p
                      className={`${
                          isDarkMode ? 'text-gray-400' : 'text-gray-500'
                      } text-lg`}
                  >
                      Checking...
                  </p>
              ) : isBackendUp ? (
                  <p className="text-lg text-green-600">Backend is up and running! 🟢</p>
              ) : (
                  <p className="text-lg text-red-600">Backend is down! 🔴</p>
              )}
          </div>
      </div>
  );
}

export default HealthCheck