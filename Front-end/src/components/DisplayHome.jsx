import React, { useContext } from 'react'
import Navbar from './Navbar'
import AlbumItem from './AlbumItem'
import SongItem from './SongItem'
import { PlayerContext } from '../context/PlayerContext'

const DisplayHome = () => {
  const { songsData, albumsData } = useContext(PlayerContext);

  return (
    <div className="flex flex-col gap-8 pb-20">
      <Navbar />
      
      {/* Featured Charts Section */}
      <section className="px-4">
        <h2 className="text-2xl font-bold mb-6">Featured Charts</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {albumsData.map((item, index) => (
            <AlbumItem 
              key={index} 
              name={item.name} 
              desc={item.desc} 
              id={item._id} 
              image={item.image}
            />
          ))}
        </div>
      </section>

      {/* Today's Biggest Hits Section */}
      <section className="px-4">
        <h2 className="text-2xl font-bold mb-6">Today's Biggest Hits</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {songsData.map((item, index) => (
            <SongItem 
              key={index} 
              name={item.name} 
              desc={item.desc} 
              id={item._id} 
              image={item.image} 
            />
          ))}
        </div>
      </section>
    </div>
  )
}

export default DisplayHome
