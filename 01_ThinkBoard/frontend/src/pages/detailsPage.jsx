import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router";
import api from "../lib/axios";
import toast from "react-hot-toast";
import { LoaderIcon,ArrowLeftIcon,Trash2Icon } from "lucide-react";


const detailsPage = () => {
  const { id } = useParams();
  const [note, setNote] = useState({});
  const [loading, setLoading] = useState(true);
  const [issaving, setIssaving] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchNote = async () => {
      try {
        const res = await api.get(`/notes/${id}`);
        if (res.status === 200) {
          setNote(res.data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
        toast.error("Error fetching notes");
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);


  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this note?")) {
      return;
    }
    try {
      await api.delete(`/notes/${id}`);
      toast.success("Note deleted successfully");
      navigate("/");
    } catch (error) {
      console.error(error);
      toast.error("Error deleting note");
    }
  };


  const handleSave = async () => {
    if (!note.title || !note.content) {
      return toast.error("All fields are required");
    }
    try {
      setIssaving(true);
      await api.put(`/notes/${id}`, note);
      toast.success("Note saved successfully");
      setIssaving(false);
    } catch (error) {
      console.error(error);
      toast.error("Error saving note");
      setIssaving(false);
    }
  };




  if (loading) {
    return (
      <div className="min-h-screen bg-base-200 flex items-center justify-center">
        <LoaderIcon className="animate-spin size-10" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-base-200">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <Link to="/" className="btn btn-ghost">
              <ArrowLeftIcon className="h-5 w-5" />
              Back to Notes
            </Link>
            <button onClick={handleDelete} className="btn btn-error btn-outline">
              <Trash2Icon className="h-5 w-5" />
              Delete Note
            </button>
          </div>

          <div className="card bg-base-100">
            <div className="card-body">
              <div className="form-control mb-4">
                <label className="label mb-1">
                  <span className="label-text">Title</span>
                </label>
                <input
                  type="text"
                  placeholder="Note title"
                  className="input input-bordered w-full rounded-2xl"
                  value={note.title}
                  onChange={(e) => setNote({ ...note, title: e.target.value })}
                />
              </div>

              <div className="form-control mb-4">
                <label className="label mb-1">
                  <span className="label-text">Content</span>
                </label>
                <textarea
                  placeholder="Write your note here..."
                  className="textarea textarea-bordered h-32 w-full rounded-2xl"
                  value={note.content}
                  onChange={(e) => setNote({ ...note, content: e.target.value })}
                />
              </div>

              <div className="card-actions justify-end">
                <button className="btn btn-primary" disabled={issaving} onClick={handleSave}>
                  {issaving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default detailsPage;
