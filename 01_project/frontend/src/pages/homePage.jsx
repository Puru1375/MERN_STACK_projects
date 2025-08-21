import { useEffect, useState } from 'react'
import NavBar from '../components/NavBar'
import RateLimitedUI from '../components/RateLimitedUI'
import axios from 'axios'
import toast from 'react-hot-toast'
import NoteCard from '../components/NoteCard'

const homePage = () => {
    const [isRateLimited, setIsRateLimited] = useState(false);
    const [notes,setNotes] = useState([]);
    const [loading,setLoading] = useState(true)

    useEffect(()=>{
        const fetchNotes = async () => {
            try{
                const res = await axios.get('http://localhost:5001/api/notes');
                if(res.status === 200){
                    setNotes(res.data);
                    setIsRateLimited(false);
                }
            }catch(error){
                if(error.response.status === 429){
                    setIsRateLimited(true);
                }else{
                console.error('Error fetching notes:', error);
                toast.error('Error fetching notes');
                }
            }finally{
                setLoading(false)
            }
        }

        fetchNotes();
    },[])


  return (
    <div className='min-h-screen'>
        <NavBar/>
        {isRateLimited && <RateLimitedUI/>}
        <div className='max-w-7xl mx-auto p-4 mt-6'>
            {loading && <p className='text-center text-primary py-10'>Loading notes...</p>}
            {notes.length > 0 && !isRateLimited && (
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'>
                    {notes.map((note) => (
                        <NoteCard key={note._id} note={note} />
                    ))}
                </div>
            )}
        </div>
    </div>
  )
}

export default homePage