import { v2 as cloudinary } from "cloudinary";
import songModel from "../models/songModel.js";
import { response } from "express";
import fs from 'fs/promises';

const addSong = async (req,res)=>{
    try {
        const name = req.body.name;
        const desc = req.body.desc;
        const album = req.body.album;
        const audioFile = req.files.audio[0];
        const imageFile = req.files.image[0];
        const videoFile = req.files.video ? req.files.video[0] : null;
        const lyricsFile = req.files.lyrics ? req.files.lyrics[0] : null;

        // Upload audio file
        const audioUpload = await cloudinary.uploader.upload(audioFile.path,{resource_type:"video"});
        
        // Upload image file
        const imageUpload = await cloudinary.uploader.upload(imageFile.path,{resource_type:"image"});
        
        // Upload video file if provided
        let videoUrl = null;
        if (videoFile) {
            const videoUpload = await cloudinary.uploader.upload(videoFile.path,{resource_type:"video"});
            videoUrl = videoUpload.secure_url;
        }

        // Process lyrics file if provided
        let lyrics = null;
        if (lyricsFile) {
            // Read the lyrics file content using ES modules
            lyrics = await fs.readFile(lyricsFile.path, 'utf8');
        }

        const duration = `${Math.floor(audioUpload.duration/60)}:${Math.floor(audioUpload.duration%60)}`

        const songData = {
            name,
            desc,
            album,
            image: imageUpload.secure_url,
            file: audioUpload.secure_url,
            duration,
            videoUrl,
            lyrics
        }

        const song = songModel(songData);
        await song.save();

        res.json({success:true,message:"Song Added"})
    } catch (error) {
        console.error("Error adding song:", error);
        res.json({success:false, message: error.message})
    }
}

const listSong = async (req,res)=>{
    try {
        const allSongs = await songModel.find({});
        res.json({success:true,songs:allSongs});
    } catch (error) {
        res.json({success:false});
    }
}

const removeSong = async(req,res)=>{
    try {
        await songModel.findByIdAndDelete(req.body.id);
        res.json({success:true,message:"Song Removed"});
    } catch (error) {
        res.json({success:false});
    }
}

const getSongDetails = async (req, res) => {
    try {
        const songId = req.params.id;
        const song = await songModel.findById(songId);
        
        if (!song) {
            return res.status(404).json({ success: false, message: "Song not found" });
        }

        res.json({
            success: true,
            videoUrl: song.videoUrl,
            lyrics: song.lyrics
        });
    } catch (error) {
        console.error("Error fetching song details:", error);
        res.status(500).json({ success: false, message: "Error fetching song details" });
    }
}

export {addSong,listSong,removeSong,getSongDetails}