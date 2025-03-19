"use client"

import { useState, useRef, useEffect } from "react"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX } from "lucide-react"
import { Button } from "@/components/ui/button"

// Define your songs directly in the code
// For testing purposes, we'll use URLs that are guaranteed to work
const PLAYLIST = [
  {
    id: "song1",
    name: "ogusers gg",
    // Using a sample audio file that's guaranteed to exist
    url: "c:\Users\Fraud\Downloads\ogusers gg.mp3",
  },
  {
    id: "song2",
    name: "swatted",
    url: "c:\Users\Fraud\Downloads\Swatted.mp3",
  },
 // {
    //id: "song3",
   // name: "Sample Audio 3",
   // url: "https://actions.google.com/sounds/v1/alarms/alarm_clock.ogg",
  //},
  // Replace these with your actual audio files when you have them
]

export default function Home() {
  const [currentSongIndex, setCurrentSongIndex] = useState<number>(0)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const audioRef = useRef<HTMLAudioElement>(null)

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
        // Don't update state here, let the onPause event handler do it
      } else {
        // Reset error state when trying to play
        setError(null)
        audioRef.current.play().catch((err) => {
          console.error("Playback failed:", err)
          setError("Couldn't play audio. Please check your audio files.")
          setIsPlaying(false)
        })
        // Don't update state here, let the onPlay event handler do it
      }
    }
  }

  const toggleMute = () => {
    if (audioRef.current) {
      audioRef.current.muted = !isMuted
      setIsMuted(!isMuted)
    }
  }

  const playNext = () => {
    if (PLAYLIST.length > 0) {
      setCurrentSongIndex((prev) => (prev + 1) % PLAYLIST.length)
      setIsPlaying(true)
      setError(null)
      setIsLoading(true)
    }
  }

  const playPrevious = () => {
    if (PLAYLIST.length > 0) {
      setCurrentSongIndex((prev) => (prev - 1 + PLAYLIST.length) % PLAYLIST.length)
      setIsPlaying(true)
      setError(null)
      setIsLoading(true)
    }
  }

  // Handle auto-play when song changes
  useEffect(() => {
    if (audioRef.current && isPlaying) {
      audioRef.current.play().catch((err) => {
        console.error("Playback failed:", err)
        setError("Couldn't play audio. Please check your audio files.")
        setIsPlaying(false)
      })
    }
  }, [currentSongIndex])

  // Handle song ending
  useEffect(() => {
    const handleEnded = () => {
      playNext()
    }

    const handleCanPlay = () => {
      setIsLoading(false)
    }

    const handleError = () => {
      setError("Error loading audio. Please check your audio files.")
      setIsLoading(false)
      setIsPlaying(false)
    }

    const audioElement = audioRef.current
    if (audioElement) {
      audioElement.addEventListener("ended", handleEnded)
      audioElement.addEventListener("canplay", handleCanPlay)
      audioElement.addEventListener("error", handleError)

      return () => {
        audioElement.removeEventListener("ended", handleEnded)
        audioElement.removeEventListener("canplay", handleCanPlay)
        audioElement.removeEventListener("error", handleError)
      }
    }
  }, [])

  const currentSong = PLAYLIST[currentSongIndex]

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-black text-white">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold mb-2">@esluter :3</h1>
        <p className="text-xl">niggas wish to be me so bad</p>
      </div>

      {/* Hidden audio element */}
      <audio
        ref={audioRef}
        src={currentSong.url}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      {/* Status message for debugging */}
      {error && <div className="text-red-400 mb-4 text-sm max-w-xs text-center">{error}</div>}

      {/* Minimal playback controls */}
      <div className="flex items-center gap-3">
        <Button
          onClick={playPrevious}
          variant="outline"
          size="icon"
          disabled={isLoading}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <SkipBack size={16} />
        </Button>

        <Button
          onClick={togglePlay}
          variant="outline"
          size="icon"
          disabled={isLoading && !error}
          className="bg-white/10 hover:bg-white/20 text-white h-12 w-12"
        >
          {isPlaying ? <Pause size={20} /> : <Play size={20} />}
        </Button>

        <Button
          onClick={playNext}
          variant="outline"
          size="icon"
          disabled={isLoading}
          className="bg-white/10 hover:bg-white/20 text-white"
        >
          <SkipForward size={16} />
        </Button>

        <Button
          onClick={toggleMute}
          variant="outline"
          size="icon"
          className="bg-white/10 hover:bg-white/20 text-white ml-2"
        >
          {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
        </Button>
      </div>

      {/* Instructions for replacing sample audio */}
      <div className="mt-8 text-xs text-white/50 max-w-xs text-center">
        <p>Replace the sample audio URLs in the code with your own audio files.</p>
      </div>
    </main>
  )
}

