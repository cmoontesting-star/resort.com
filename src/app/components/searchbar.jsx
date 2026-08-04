import React from 'react'

const searchbar = () => {
  return (
    <div className="relative w-full max-w-lg">
    <input
      type="text"
      placeholder="Search Here..."
      className="rounded-xl border border-gray bg-white px-8 py-2 text-gray-700 shadow-sm "
    />
    </div>
  )
}

export default searchbar