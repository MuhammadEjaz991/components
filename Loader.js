import CircularProgress from '@mui/material/CircularProgress';
const [loading, setLoading] = useState(true);

<div>
    {loading ? <CircularProgress /> : "Your Content Here"}
</div>