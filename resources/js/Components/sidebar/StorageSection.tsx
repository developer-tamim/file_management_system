import React, { useState } from "react"
import { useSelector } from "react-redux"
import type { RootState } from "../store" // adjust import to your project structure
import StorageItem from "./StorageItem"

interface StorageSectionProps {
  onConnectStorage?: (providerId: string) => void
}

const StorageSection: React.FC<StorageSectionProps> = ({ onConnectStorage }) => {
  const [isOpen, setIsOpen] = useState(true)
  const storageProviders = useSelector((state: RootState) => state.storageProviders)

  const toggleOpen = () => {
    setIsOpen(prev => !prev)
  }

  return (
    <div className="p-4 border rounded-md shadow">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-xl font-semibold">Storage Providers</h2>
        <button onClick={toggleOpen} className="text-sm text-blue-500">
          {isOpen ? "Hide" : "Show"}
        </button>
      </div>

      {isOpen && (
        <div className="space-y-2">
          {storageProviders.map((provider: any) => (
            <div key={provider.id}>
              <StorageItem provider={provider} />
              {onConnectStorage && (
                <button
                  className="mt-1 text-sm text-blue-600"
                  onClick={() => onConnectStorage(provider.id)}
                >
                  Connect
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default StorageSection
