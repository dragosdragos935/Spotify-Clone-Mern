import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'

const SongItem = ({ name, image, desc, id }) => {
  const { playWithId } = useContext(PlayerContext)

  return (
    <div 
      onClick={() => playWithId(id)} 
      className="group bg-[#181818] p-4 rounded-md hover:bg-[#282828] transition-colors duration-200 cursor-pointer"
    >
      <div className="relative aspect-square mb-4">
        <img 
          className="w-full h-full object-cover rounded-md shadow-lg" 
          src={image} 
          alt={name} 
        />
        <button className="absolute bottom-2 right-2 w-12 h-12 bg-[#1DB954] rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 shadow-lg">
          <svg className="w-6 h-6 text-black" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z"/>
          </svg>
        </button>
      </div>
      <h3 className="font-bold text-white truncate">{name}</h3>
      <p className="text-sm text-gray-400 mt-1 line-clamp-2">{desc}</p>
    </div>
  )
}

export default SongItem
