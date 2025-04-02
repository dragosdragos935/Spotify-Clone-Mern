import React, { useContext } from 'react'
import { PlayerContext } from '../context/PlayerContext'

const VideoPlayer = () => {
  const { track } = useContext(PlayerContext)

  if (!track) return null

  return (
    <div className="flex h-full gap-4">
      {/* Video Section */}
      <div className="w-1/2 h-full bg-black rounded-lg overflow-hidden">
        {track.videoUrl ? (
          <video
            className="w-full h-full object-cover"
            src={track.videoUrl}
            controls
            autoPlay
            muted
            loop
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[#282828]">
            <p className="text-gray-400">No video available</p>
          </div>
        )}
      </div>

      {/* Lyrics Section */}
      <div className="w-1/2 h-full bg-[#282828] rounded-lg p-6 overflow-y-auto">
        <h3 className="text-xl font-bold mb-4">Lyrics</h3>
        {track.lyrics ? (
          <div className="whitespace-pre-wrap text-gray-300">
            {track.lyrics}
          </div>
        ) : (
          <p className="text-gray-400">No lyrics available</p>
        )}
      </div>
    </div>
  )
}

export default VideoPlayer 