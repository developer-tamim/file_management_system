import React from "react"

interface Provider {
  // Define the expected properties of provider here
  name: string
  // add more fields as needed
}

interface StorageItemProps {
  provider: Provider
}

const StorageItem: React.FC<StorageItemProps> = ({ provider }) => {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-lg font-semibold">{provider.name}</h2>
      {/* Render additional provider details as needed */}
    </div>
  )
}

export default StorageItem
