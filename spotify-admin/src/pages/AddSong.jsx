import React, { useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import axios from 'axios';
import { url } from '../App';
import { toast } from 'react-toastify';

const AddSong = () => {
  const [image, setImage] = useState(null);
  const [song, setSong] = useState(null);
  const [video, setVideo] = useState(null);
  const [lyrics, setLyrics] = useState(null);
  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [album, setAlbum] = useState('none');
  const [loading, setLoading] = useState(false);
  const [albumData, setAlbumData] = useState([]);

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('desc', desc);

      if (image) {
        formData.append('image', image);
      }

      if (song) {
        formData.append('audio', song);
      }

      if (video) {
        formData.append('video', video);
      }

      if (lyrics) {
        formData.append('lyrics', lyrics);
      }

      formData.append('album', album);

      console.log('Form Data Entries:');
      for (let [key, value] of formData.entries()) {
        console.log(`${key}:`, value);
      }

      const response = await axios.post(`http://localhost:4000/api/song/add`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      console.log('API Response:', response);

      if (response.data.success) {
        toast.success('Song Added');
        setName('');
        setDesc('');
        setAlbum('none');
        setImage(null);
        setSong(null);
        setVideo(null);
        setLyrics(null);
      } else {
        toast.error('Something went wrong');
        console.log('Failed Response Data:', response.data);
      }
    } catch (error) {
      console.error('Request Failed:', error);

      if (error.response) {
        console.error('Error Response Data:', error.response.data);
        toast.error(error.response.data.message || 'Error occurred');
      } else if (error.request) {
        console.error('No Response Received:', error.request);
        toast.error('Server did not respond');
      } else {
        console.error('Request Setup Error:', error.message);
        toast.error('Unexpected Error');
      }
    }

    setLoading(false);
  };

  const loadAlbumData = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/album/list`);
      if (response.data.success) {
        setAlbumData(response.data.albums);
      } else {
        toast.error('Error: Unable to load albums data');
      }
    } catch (error) {
      toast.error('Error occurred');
    }
  };

  useEffect(() => {
    loadAlbumData();
  }, []);

  return loading ? (
    <div className='grid place-items-center min-h-[80vh]'>
      <div className='w-16 h-16 place-self-center border-4 border-gray-400 border-t-green-800 rounded-full animate-spin'></div>
    </div>
  ) : (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-start gap-8 text-gray-600'>
      <div className='flex gap-8'>
        <div className='flex flex-col gap-4'>
          <p>Upload song</p>
          <input onChange={(e) => setSong(e.target.files[0])} type='file' id='song' accept='audio/*' hidden />
          <label htmlFor='song'>
            <img src={song ? assets.upload_added : assets.upload_song} className='w-24 cursor-pointer' alt='' />
          </label>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Upload Image</p>
          <input onChange={(e) => setImage(e.target.files[0])} type='file' id='image' accept='image/*' hidden />
          <label htmlFor='image'>
            {image ? <img src={URL.createObjectURL(image)} className='w-24 cursor-pointer' alt='' /> : <img src={assets.upload_area} className='w-24 cursor-pointer' alt='' />}
          </label>
        </div>
      </div>

      <div className='flex gap-8'>
        <div className='flex flex-col gap-4'>
          <p>Upload Video (MP4)</p>
          <input onChange={(e) => setVideo(e.target.files[0])} type='file' id='video' accept='video/mp4' hidden />
          <label htmlFor='video'>
            <img src={video ? assets.upload_added : assets.upload_area} className='w-24 cursor-pointer' alt='' />
          </label>
        </div>
        <div className='flex flex-col gap-4'>
          <p>Upload Lyrics (TXT)</p>
          <input onChange={(e) => setLyrics(e.target.files[0])} type='file' id='lyrics' accept='.txt' hidden />
          <label htmlFor='lyrics'>
            <img src={lyrics ? assets.upload_added : assets.upload_area} className='w-24 cursor-pointer' alt='' />
          </label>
        </div>
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Song name</p>
        <input onChange={(e) => setName(e.target.value)} value={name} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' required type='text' />
      </div>
      <div className='flex flex-col gap-2.5'>
        <p>Song Description</p>
        <input onChange={(e) => setDesc(e.target.value)} value={desc} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[max(40vw,250px)]' placeholder='Type here' required type='text' />
      </div>

      <div className='flex flex-col gap-2.5'>
        <p>Album</p>
        <select onChange={(e) => setAlbum(e.target.value)} value={album} className='bg-transparent outline-green-600 border-2 border-gray-400 p-2.5 w-[150px]'>
          <option value='none'>None</option>
          {albumData.map((item, index) => (
            <option key={index} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
      </div>

      <button type='submit' className='text-base bg-black text-white py-2.5 px-14 cursor-pointer'>
        ADD
      </button>
    </form>
  );
};

export default AddSong;
