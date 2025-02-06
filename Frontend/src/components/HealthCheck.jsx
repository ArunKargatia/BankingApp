import React, { useEffect, useState } from 'react'
import backendUrl from '../BackendUrlConfig'

function HealthCheck() {

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
    <div className="flex justify-center items-center h-screen bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-md w-96 text-center">
        <h2 className="text-2xl font-bold mb-4">Backend Health Check</h2>
        {isBackendUp === null ? (
          <p className="text-lg text-gray-500">Checking...</p>
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